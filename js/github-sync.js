/* ═══════════════════ GITHUB SYNC ENGINE v6.0 (RATE-LIMIT SAFE & INSTANT COMMIT SHA) ═══════════════════ */
const GitHubSync = (() => {
  const TOKEN_KEY = "mta_2026_gh_token";
  const REPO_KEY  = "mta_2026_gh_repo";
  const FILE_PATH = "data/tiers.json";

  let verifiedUser = null;
  let detectedBranch = "main";
  let lastKnownCommitSha = "";
  let lastEtag = "";
  const blobUrlCache = new Map();

  /* 100% точное определение owner/repo прямо из ссылки GitHub Pages */
  function detectRepoFromLocation() {
    try {
      const host = window.location.hostname; // например: username.github.io
      const pathParts = window.location.pathname.split("/").filter(Boolean);
      if (host.endsWith(".github.io")) {
        const owner = host.replace(".github.io", "");
        const firstSeg = pathParts[0] && !pathParts[0].endsWith(".html") ? pathParts[0] : `${owner}.github.io`;
        return `${owner}/${firstSeg}`;
      }
    } catch {}
    return "geraltschwarzenegger-svg/myTierAnime";
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY) || "";
  }

  function getRepo() {
    const saved = localStorage.getItem(REPO_KEY);
    const detected = detectRepoFromLocation();
    // Если мы находимся на реальном домене *.github.io, доверяем реальному адресу страницы!
    if (window.location.hostname.endsWith(".github.io") && (!saved || saved === "geraltschwarzenegger-svg/myTierAnime")) {
      return detected;
    }
    return saved || detected;
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

  /* Экономичное получение последнего коммита с поддержкой If-None-Match (ETag),
     благодаря чему GitHub НЕ списывает лимит запросов у зрителей! */
  async function getLatestBranchCommitSha(useEtag = false) {
    const repo = getRepo();
    const tk = getToken();
    const headers = { "Accept": "application/vnd.github+json" };
    if (tk) headers["Authorization"] = `Bearer ${tk}`;
    if (useEtag && lastEtag) headers["If-None-Match"] = lastEtag;

    for (const br of [detectedBranch, "main", "master"]) {
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}/commits/${br}`, {
          headers,
          cache: "no-store"
        });
        if (res.status === 304) {
          return { notModified: true, commitSha: lastKnownCommitSha };
        }
        if (res.ok) {
          const etag = res.headers.get("etag");
          if (etag) lastEtag = etag;
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

  /* НАДЁЖНОЕ ЧТЕНИЕ АКТУАЛЬНОЙ БАЗЫ У ЗРИТЕЛЕЙ ПО ССЫЛКЕ */
  async function fetchFreshTiersFromApi(force = false) {
    const repo = getRepo();
    const tk = getToken();
    const headers = { "Accept": "application/vnd.github+json" };
    if (tk) headers["Authorization"] = `Bearer ${tk}`;

    try {
      const branchInfo = await getLatestBranchCommitSha(!force);
      if (branchInfo?.notModified && !force) {
        return null;
      }

      if (branchInfo && branchInfo.commitSha) {
        if (!force && branchInfo.commitSha === lastKnownCommitSha) {
          return null;
        }

        // Способ 1: Прямое скачивание по уникальному SHA коммита (не имеет кэша и не тратит лимиты API!)
        try {
          const rawRes = await fetch(`https://raw.githubusercontent.com/${repo}/${branchInfo.commitSha}/${FILE_PATH}`, {
            cache: "no-store"
          });
          if (rawRes.ok) {
            const parsed = await rawRes.json();
            lastKnownCommitSha = branchInfo.commitSha;
            return parsed;
          }
        } catch {}

        // Способ 2: Чтение через Git Tree -> Blob API
        if (branchInfo.treeSha) {
          const treeRes = await fetch(`https://api.github.com/repos/${repo}/git/trees/${branchInfo.treeSha}?recursive=1`, {
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
      console.warn("Primary Git fetch warning:", e);
    }

    // Способ 3: Если лимит API исчерпан — читаем через raw.githubusercontent.com по имени ветки со случайным параметром
    for (const br of [detectedBranch, "main", "master"]) {
      try {
        const rRes = await fetch(`https://raw.githubusercontent.com/${repo}/${br}/${FILE_PATH}?nocache=${Date.now()}`, {
          cache: "no-store"
        });
        if (rRes.ok) return await rRes.json();
      } catch {}
    }

    // Способ 4: Локальный относительный файл на GitHub Pages
    try {
      const resLocal = await fetch(`data/tiers.json?nocache=${Date.now()}`, { cache: "no-store" });
      if (resLocal.ok) return await resLocal.json();
    } catch {}

    return null;
  }

  /* Загрузка любого файла (фона или обложки) без ограничений размера */
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
      throw new Error(err.message || `Ошибка загрузки файла (${blobRes.status})`);
    }
    const createdBlob = await blobRes.json();
    const blobSha = createdBlob.sha;
    blobUrlCache.set(blobSha, blobUrl);

    return {
      path: relPath,
      blobSha,
      mime,
      instantUrl: blobUrl
    };
  }

  /* Разрешение URL картинки фона или обложки для всех зрителей по ссылке */
  async function resolveAssetUrl(pathOrUrl, blobSha, mime = "image/jpeg") {
    if (!pathOrUrl && !blobSha) return "";
    if (blobSha && blobUrlCache.has(blobSha)) {
      return blobUrlCache.get(blobSha);
    }
    if (pathOrUrl && (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://") || pathOrUrl.startsWith("data:") || pathOrUrl.startsWith("blob:"))) {
      return pathOrUrl;
    }

    const repo = getRepo();
    if (pathOrUrl) {
      const cleanPath = pathOrUrl.replace(/^\.?\//, "");
      const ref = lastKnownCommitSha || detectedBranch || "main";
      const rawCommitUrl = `https://raw.githubusercontent.com/${repo}/${ref}/${cleanPath}`;
      try {
        const check = await fetch(rawCommitUrl, { method: "HEAD", cache: "no-store" });
        if (check.ok) return rawCommitUrl;
      } catch {}
    }

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
      } catch {}
    }

    return pathOrUrl;
  }

  /* АТОМАРНЫЙ КОММИТ ВСЕХ ИЗМЕНЕНИЙ И ФОНА В РЕПОЗИТОРИЙ ВЛАДЕЛЬЦА */
  async function commitTiersToGitHub(payloadObj, commitMsg = "Sync via myTierAnime") {
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

    const branchInfo = await getLatestBranchCommitSha(false);
    if (branchInfo && branchInfo.commitSha && branchInfo.treeSha) {
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
        const treeEntries = [{
          path: FILE_PATH,
          mode: "100644",
          type: "blob",
          sha: newBlob.sha
        }];

        // Если есть загруженный фон с blobSha, привязываем и его в дерево репозитория
        if (payloadObj.meta.bgImage && payloadObj.meta.bgBlobSha && !payloadObj.meta.bgImage.startsWith("http")) {
          treeEntries.push({
            path: payloadObj.meta.bgImage.replace(/^\.?\//, ""),
            mode: "100644",
            type: "blob",
            sha: payloadObj.meta.bgBlobSha
          });
        }

        const treeRes = await fetch(`https://api.github.com/repos/${repo}/git/trees`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            base_tree: branchInfo.treeSha,
            tree: treeEntries
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

    // Резервный PUT /contents/data/tiers.json
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
      throw new Error(errJson.message || `Ошибка GitHub API (${putRes.status}) для репозитория ${repo}`);
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
    detectRepoFromLocation,
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
