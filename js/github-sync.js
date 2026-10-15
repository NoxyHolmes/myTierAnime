/* ═══════════════════ GITHUB GIT DATA & BLOB API (NO SIZE LIMITS, 1-SECOND REALTIME SYNC) ═══════════════════ */
const GitHubSync = (() => {
  const TOKEN_KEY = "mta_2026_gh_token";
  const REPO_KEY  = "mta_2026_gh_repo";
  const DEFAULT_REPO = "geraltschwarzenegger-svg/myTierAnime";
  const FILE_PATH = "data/tiers.json";

  let verifiedUser = null;
  let detectedBranch = "main";
  let lastKnownCommitSha = "";
  const blobUrlCache = new Map();

  /* Автоматическое определение owner/repo прямо из адресной строки GitHub Pages */
  function detectRepoFromLocation() {
    try {
      const host = window.location.hostname;
      const pathParts = window.location.pathname.split("/").filter(Boolean);
      if (host.endsWith(".github.io")) {
        const owner = host.replace(".github.io", "");
        const repo = pathParts[0] || `${owner}.github.io`;
        if (owner && repo) return `${owner}/${repo}`;
      }
    } catch {}
    return DEFAULT_REPO;
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY) || "";
  }

  function getRepo() {
    return localStorage.getItem(REPO_KEY) || detectRepoFromLocation();
  }

  function isOwner() {
    return !!getToken() && document.body.classList.contains("is-owner");
  }

  function saveCredentials(token, repo) {
    if (token) localStorage.setItem(TOKEN_KEY, token.trim());
    else localStorage.removeItem(TOKEN_KEY);
    if (repo) localStorage.setItem(REPO_KEY, repo.trim());
  }

  function utf8ToBase64(str) {
    const bytes = new TextEncoder().encode(str);
    let binary = "";
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
  }

  function base64ToUint8Array(b64) {
    const clean = b64.replace(/\s/g, "");
    const binary = atob(clean);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  function base64ToUtf8(b64) {
    const bytes = base64ToUint8Array(b64);
    return new TextDecoder("utf-8").decode(bytes);
  }

  /* Чтение любого файла с ПК БЕЗ СЖАТИЯ И БЕЗ ОГРАНИЧЕНИЙ РАЗМЕРА (100% оригинал) */
  function fileToRawBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const buffer = reader.result;
        const bytes = new Uint8Array(buffer);
        let binary = "";
        const chunkSize = 0x8000;
        for (let i = 0; i < bytes.length; i += chunkSize) {
          binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
        }
        const base64 = btoa(binary);
        const blobUrl = URL.createObjectURL(file);
        resolve({ base64, blobUrl, mime: file.type || "image/png", size: file.size });
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  async function verifyToken(token) {
    const tk = (token ?? getToken()).trim();
    if (!tk) {
      verifiedUser = null;
      return null;
    }
    try {
      const res = await fetch("https://api.github.com/user", {
        headers: {
          "Authorization": `Bearer ${tk}`,
          "Accept": "application/vnd.github+json"
        },
        cache: "no-store"
      });
      if (!res.ok) {
        verifiedUser = null;
        return null;
      }
      const data = await res.json();
      verifiedUser = data;
      return data;
    } catch (err) {
      console.warn("GitHub token verification error:", err);
      return null;
    }
  }

  /* Получение самого свежего SHA коммита ветки (не кэшируется CDN!) */
  async function getLatestBranchCommitSha() {
    const repo = getRepo();
    const tk = getToken();
    const headers = { "Accept": "application/vnd.github+json" };
    if (tk) headers["Authorization"] = `Bearer ${tk}`;

    for (const br of [detectedBranch, "main", "master"]) {
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}/commits/${br}?_=${Date.now()}`, {
          headers,
          cache: "no-store"
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.sha) {
            detectedBranch = br;
            return { commitSha: data.sha, treeSha: data.commit?.tree?.sha };
          }
        }
      } catch {}
    }
    return null;
  }

  /* МГНОВЕННОЕ ЧТЕНИЕ БАЗЫ data/tiers.json ЧЕРЕЗ GIT BLOB SHA (ОБХОД ЛЮБОГО КЭША И ЛИМИТА 1 МБ) */
  async function fetchFreshTiersFromApi(forceIfSameCommit = false) {
    const repo = getRepo();
    const tk = getToken();
    const headers = { "Accept": "application/vnd.github+json" };
    if (tk) headers["Authorization"] = `Bearer ${tk}`;

    try {
      const branchInfo = await getLatestBranchCommitSha();
      if (branchInfo && branchInfo.commitSha) {
        if (!forceIfSameCommit && branchInfo.commitSha === lastKnownCommitSha) {
          return null; // Коммит не менялся
        }

        // 1. Пробуем мгновенно скачать через raw.githubusercontent.com/<owner>/<repo>/<COMMIT_SHA>/data/tiers.json
        // Поскольку в ссылке зашит уникальный SHA коммита, CDN никогда не отдаёт старый кэш!
        try {
          const rawRes = await fetch(`https://raw.githubusercontent.com/${repo}/${branchInfo.commitSha}/${FILE_PATH}?_=${Date.now()}`, {
            cache: "no-store"
          });
          if (rawRes.ok) {
            const parsed = await rawRes.json();
            lastKnownCommitSha = branchInfo.commitSha;
            return parsed;
          }
        } catch {}

        // 2. Если файл огромный или приватный — читаем напрямую через Git Tree -> Git Blob API (до 100 МБ)
        if (branchInfo.treeSha) {
          const treeRes = await fetch(`https://api.github.com/repos/${repo}/git/trees/${branchInfo.treeSha}?recursive=1&_=${Date.now()}`, {
            headers,
            cache: "no-store"
          });
          if (treeRes.ok) {
            const treeData = await treeRes.json();
            const fileNode = (treeData.tree || []).find(n => n.path === FILE_PATH);
            if (fileNode && fileNode.sha) {
              const blobRes = await fetch(`https://api.github.com/repos/${repo}/git/blobs/${fileNode.sha}`, {
                headers,
                cache: "no-store"
              });
              if (blobRes.ok) {
                const blobData = await blobRes.json();
                if (blobData.content) {
                  lastKnownCommitSha = branchInfo.commitSha;
                  return JSON.parse(base64ToUtf8(blobData.content));
                }
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn("Git Data API fetch fallback:", e);
    }

    // 3. Резервный запрос
    try {
      const res3 = await fetch(`data/tiers.json?nocache=${Date.now()}`, { cache: "no-store" });
      if (res3.ok) return await res3.json();
    } catch {}

    return null;
  }

  /* Загрузка ЛЮБОГО файла (фона или постера) БЕЗ ОГРАНИЧЕНИЙ РАЗМЕРА через Git Data API */
  async function uploadAssetFile(file, folder = "posters") {
    const tk = getToken();
    const repo = getRepo();
    if (!tk) throw new Error("Токен владельца не задан");

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const relPath = `${folder}/${Date.now()}_${safeName}`;
    const { base64, blobUrl, mime } = await fileToRawBase64(file);

    const headers = {
      "Authorization": `Bearer ${tk}`,
      "Accept": "application/vnd.github+json",
      "Content-Type": "application/json"
    };

    // Создаём Git Blob напрямую (поддерживает файлы до 100 МБ без сжатия!)
    const blobRes = await fetch(`https://api.github.com/repos/${repo}/git/blobs`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        content: base64,
        encoding: "base64"
      })
    });

    if (!blobRes.ok) {
      const err = await blobRes.json().catch(() => ({}));
      throw new Error(err.message || `Ошибка создания Git Blob (${blobRes.status})`);
    }
    const createdBlob = await blobRes.json();
    const blobSha = createdBlob.sha;

    // Кэшируем мгновенный локальный Blob URL для этого SHA
    blobUrlCache.set(blobSha, blobUrl);

    // Также привязываем файл в дерево репозитория, чтобы он лежал в папке posters/ или backgrounds/
    try {
      const branchInfo = await getLatestBranchCommitSha();
      if (branchInfo && branchInfo.commitSha && branchInfo.treeSha) {
        const newTreeRes = await fetch(`https://api.github.com/repos/${repo}/git/trees`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            base_tree: branchInfo.treeSha,
            tree: [{
              path: relPath,
              mode: "100644",
              type: "blob",
              sha: blobSha
            }]
          })
        });
        if (newTreeRes.ok) {
          const newTree = await newTreeRes.json();
          const newCommitRes = await fetch(`https://api.github.com/repos/${repo}/git/commits`, {
            method: "POST",
            headers,
            body: JSON.stringify({
              message: `Upload ${relPath} (uncompressed)`,
              tree: newTree.sha,
              parents: [branchInfo.commitSha]
            })
          });
          if (newCommitRes.ok) {
            const newCommit = await newCommitRes.json();
            await fetch(`https://api.github.com/repos/${repo}/git/refs/heads/${detectedBranch}`, {
              method: "PATCH",
              headers,
              body: JSON.stringify({ sha: newCommit.sha, force: true })
            });
            lastKnownCommitSha = newCommit.sha;
          }
        }
      }
    } catch (e) {
      console.warn("Tree attach warning:", e);
    }

    return {
      path: relPath,
      blobSha,
      mime,
      instantUrl: blobUrl
    };
  }

  /* Мгновенная загрузка картинки фона или обложки у зрителей по её Git Blob SHA (работает за 0.2 сек, не ждёт GitHub Pages!) */
  async function resolveAssetUrl(pathOrUrl, blobSha, mime = "image/jpeg") {
    if (!pathOrUrl && !blobSha) return "";
    if (blobSha && blobUrlCache.has(blobSha)) {
      return blobUrlCache.get(blobSha);
    }
    if (pathOrUrl && (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://") || pathOrUrl.startsWith("data:") || pathOrUrl.startsWith("blob:"))) {
      return pathOrUrl;
    }

    const repo = getRepo();
    // 1. Если известен commitSha и относительный путь — грузим напрямую с raw.githubusercontent.com по SHA коммита
    if (pathOrUrl && lastKnownCommitSha) {
      const cleanPath = pathOrUrl.replace(/^\.?\//, "");
      const rawCommitUrl = `https://raw.githubusercontent.com/${repo}/${lastKnownCommitSha}/${cleanPath}`;
      try {
        const check = await fetch(rawCommitUrl, { method: "HEAD", cache: "no-store" });
        if (check.ok) return rawCommitUrl;
      } catch {}
    }

    // 2. Если есть blobSha — скачиваем бинарник напрямую из Git Blob API (без лимита размера и без кэша)
    if (blobSha) {
      try {
        const tk = getToken();
        const headers = { "Accept": "application/vnd.github+json" };
        if (tk) headers["Authorization"] = `Bearer ${tk}`;
        const res = await fetch(`https://api.github.com/repos/${repo}/git/blobs/${blobSha}`, {
          headers,
          cache: "no-store"
        });
        if (res.ok) {
          const data = await res.json();
          if (data.content) {
            const bytes = base64ToUint8Array(data.content);
            const blob = new Blob([bytes], { type: mime });
            const objUrl = URL.createObjectURL(blob);
            blobUrlCache.set(blobSha, objUrl);
            return objUrl;
          }
        }
      } catch (e) {
        console.warn("Blob resolve error:", e);
      }
    }

    return pathOrUrl;
  }

  /* Атомарное сохранение базы data/tiers.json через Git Data API (без ограничений размера и с мгновенным обновлением ветки) */
  async function commitTiersToGitHub(payloadObj, commitMsg = "Instant sync via myTierAnime") {
    const tk = getToken();
    const repo = getRepo();
    if (!tk) throw new Error("Токен владельца не задан");

    const headers = {
      "Authorization": `Bearer ${tk}`,
      "Accept": "application/vnd.github+json",
      "Content-Type": "application/json"
    };

    payloadObj.meta = payloadObj.meta || {};
    payloadObj.meta.repo = repo;
    payloadObj.meta.updatedAt = new Date().toISOString();
    const jsonStr = JSON.stringify(payloadObj, null, 2);

    // 1. Получаем последний коммит ветки
    const branchInfo = await getLatestBranchCommitSha();
    if (branchInfo && branchInfo.commitSha && branchInfo.treeSha) {
      // Создаём Blob для data/tiers.json (поддерживает любой размер)
      const blobRes = await fetch(`https://api.github.com/repos/${repo}/git/blobs`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          content: utf8ToBase64(jsonStr),
          encoding: "base64"
        })
      });

      if (blobRes.ok) {
        const newBlob = await blobRes.json();
        const treeRes = await fetch(`https://api.github.com/repos/${repo}/git/trees`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            base_tree: branchInfo.treeSha,
            tree: [{
              path: FILE_PATH,
              mode: "100644",
              type: "blob",
              sha: newBlob.sha
            }]
          })
        });

        if (treeRes.ok) {
          const newTree = await treeRes.json();
          const commitRes = await fetch(`https://api.github.com/repos/${repo}/git/commits`, {
            method: "POST",
            headers,
            body: JSON.stringify({
              message: commitMsg,
              tree: newTree.sha,
              parents: [branchInfo.commitSha]
            })
          });

          if (commitRes.ok) {
            const createdCommit = await commitRes.json();
            const refRes = await fetch(`https://api.github.com/repos/${repo}/git/refs/heads/${detectedBranch}`, {
              method: "PATCH",
              headers,
              body: JSON.stringify({
                sha: createdCommit.sha,
                force: true
              })
            });
            if (refRes.ok) {
              lastKnownCommitSha = createdCommit.sha;
              return createdCommit;
            }
          }
        }
      }
    }

    // 2. Fallback через стандартный PUT /contents/
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${FILE_PATH}`;
    let sha = undefined;
    const getRes = await fetch(`${apiUrl}?_=${Date.now()}`, { headers, cache: "no-store" });
    if (getRes.ok) {
      const existing = await getRes.json();
      sha = existing.sha;
    }
    const body = { message: commitMsg, content: utf8ToBase64(jsonStr) };
    if (sha) body.sha = sha;
    const putRes = await fetch(apiUrl, { method: "PUT", headers, body: JSON.stringify(body) });
    if (!putRes.ok) {
      const errJson = await putRes.json().catch(() => ({}));
      throw new Error(errJson.message || `Ошибка GitHub API (${putRes.status})`);
    }
    const putData = await putRes.json();
    if (putData?.commit?.sha) lastKnownCommitSha = putData.commit.sha;
    return putData;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    verifiedUser = null;
    document.body.classList.remove("is-owner");
  }

  return {
    getToken,
    getRepo,
    isOwner,
    saveCredentials,
    verifyToken,
    fetchFreshTiersFromApi,
    fileToRawBase64,
    uploadAssetFile,
    resolveAssetUrl,
    commitTiersToGitHub,
    logout
  };
})();
