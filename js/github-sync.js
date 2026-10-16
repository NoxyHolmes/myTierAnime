/* ═══════════════════ GITHUB SYNC ENGINE v15.0 (PARALLEL TURBO SYNC & URL CACHE) ═══════════════════ */
const GitHubSync = (() => {
  const TOKEN_KEY = "mta_2026_gh_token";
  const REPO_KEY  = "mta_2026_gh_repo";
  const FILE_PATH = "data/tiers.json";

  let verifiedUser = null;
  let detectedBranch = "main";
  let lastKnownCommitSha = "";
  let cachedBranchInfo = null;
  let cachedBranchInfoTime = 0;

  const blobUrlCache = new Map();
  const resolvedUrlCache = new Map();

  function detectRepoFromLocation() {
    try {
      const host = window.location.hostname;
      const pathParts = window.location.pathname.split("/").filter(Boolean);
      if (host.endsWith(".github.io")) {
        const owner = host.replace(".github.io", "");
        const firstSeg = pathParts[0] && !pathParts[0].endsWith(".html") ? pathParts[0] : `${owner}.github.io`;
        return `${owner}/${firstSeg}`;
      }
    } catch {}
    return "noxyholmes/myTierAnime";
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY) || "";
  }

  function getRepo() {
    const saved = localStorage.getItem(REPO_KEY);
    const detected = detectRepoFromLocation();
    if (window.location.hostname.endsWith(".github.io")) {
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
        resolve({ base64, blobUrl, mime: file.type || "application/octet-stream", size: file.size });
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  function createInlineDataUrl(file, maxW = 1280, quality = 0.8) {
    if (!file || !file.type || !file.type.startsWith("image/")) {
      return Promise.resolve("");
    }
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, maxW / img.width);
          const cv = document.createElement("canvas");
          cv.width = Math.round(img.width * scale);
          cv.height = Math.round(img.height * scale);
          const ctx = cv.getContext("2d");
          ctx.drawImage(img, 0, 0, cv.width, cv.height);
          let out = cv.toDataURL("image/webp", quality);
          if (!out || out.length < 32) out = cv.toDataURL("image/jpeg", quality);
          resolve(out);
        };
        img.onerror = () => resolve("");
        img.src = e.target.result;
      };
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    });
  }

  async function verifyToken(token) {
    const tk = (token ?? getToken()).trim();
    if (!tk) {
      verifiedUser = null;
      return null;
    }
    try {
      const res = await fetch(`https://api.github.com/user?_ya=${Date.now()}`, {
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
    } catch {
      return { login: "Owner" };
    }
  }

  async function getLatestBranchCommitSha(forceFresh = false) {
    const now = Date.now();
    if (!forceFresh && cachedBranchInfo && now - cachedBranchInfoTime < 2500) {
      return cachedBranchInfo;
    }

    const repo = getRepo();
    const tk = getToken();
    const headers = { "Accept": "application/vnd.github+json" };
    if (tk) headers["Authorization"] = `Bearer ${tk}`;

    try {
      const res = await fetch(`https://api.github.com/repos/${repo}/commits/${detectedBranch}?_ya_bust=${now}`, {
        headers,
        cache: "no-store"
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.sha) {
          cachedBranchInfo = { commitSha: data.sha, treeSha: data.commit?.tree?.sha };
          cachedBranchInfoTime = now;
          return cachedBranchInfo;
        }
      }
    } catch {}

    const fallbackBranch = detectedBranch === "main" ? "master" : "main";
    try {
      const res2 = await fetch(`https://api.github.com/repos/${repo}/commits/${fallbackBranch}?_ya_bust=${now}`, {
        headers,
        cache: "no-store"
      });
      if (res2.ok) {
        const data2 = await res2.json();
        if (data2 && data2.sha) {
          detectedBranch = fallbackBranch;
          cachedBranchInfo = { commitSha: data2.sha, treeSha: data2.commit?.tree?.sha };
          cachedBranchInfoTime = now;
          return cachedBranchInfo;
        }
      }
    } catch {}

    return null;
  }

  /* Параллельная загрузка свежей базы без последовательных задержек */
  async function fetchFreshTiersFromApi(forceFresh = false) {
    const repo = getRepo();
    const now = Date.now();

    const localPromise = fetch(`data/tiers.json?_ya_nocache=${now}`, { cache: "no-store" })
      .then(r => r.ok ? r.json() : null)
      .catch(() => null);

    const remotePromise = (async () => {
      const branchInfo = await getLatestBranchCommitSha(forceFresh);
      if (!branchInfo || !branchInfo.commitSha) return null;
      lastKnownCommitSha = branchInfo.commitSha;
      const rawRes = await fetch(`https://raw.githubusercontent.com/${repo}/${branchInfo.commitSha}/${FILE_PATH}?_ya=${now}`, {
        cache: "no-store"
      });
      if (rawRes.ok) return await rawRes.json();
      return null;
    })().catch(() => null);

    const results = await Promise.all([localPromise, remotePromise]);
    const candidates = results.filter(Boolean);

    if (!candidates.length) return null;
    candidates.sort((a, b) => Number(b?.meta?.revision || 0) - Number(a?.meta?.revision || 0));
    return candidates[0];
  }

  async function uploadAssetFile(file, folder = "posters") {
    const tk = getToken();
    const repo = getRepo();
    if (!tk) throw new Error("Токен владельца не задан (нажмите «🔑 Вход»)");

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const relPath = `${folder}/${Date.now()}_${safeName}`;
    const { base64, blobUrl, mime } = await fileToRawBase64(file);

    let inlineDataUrl = "";
    if (folder !== "audio" && file.type && file.type.startsWith("image/")) {
      const maxW = folder === "backgrounds" ? 1600 : 540;
      const qual = folder === "backgrounds" ? 0.78 : 0.82;
      inlineDataUrl = await createInlineDataUrl(file, maxW, qual);
    }

    const headers = {
      "Authorization": `Bearer ${tk}`,
      "Accept": "application/vnd.github+json",
      "Content-Type": "application/json"
    };

    let blobSha = "";
    try {
      const blobRes = await fetch(`https://api.github.com/repos/${repo}/git/blobs`, {
        method: "POST",
        headers,
        body: JSON.stringify({ content: base64, encoding: "base64" })
      });
      if (blobRes.ok) {
        const createdBlob = await blobRes.json();
        blobSha = createdBlob.sha || "";
      }
    } catch {}

    if (!blobSha) {
      const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${relPath}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          message: `Upload ${relPath}`,
          content: base64
        })
      });
      if (!putRes.ok) {
        const err = await putRes.json().catch(() => ({}));
        throw new Error(err.message || `Ошибка загрузки (${putRes.status})`);
      }
      const putData = await putRes.json();
      blobSha = putData?.content?.sha || "";
      if (putData?.commit?.sha) lastKnownCommitSha = putData.commit.sha;
    }

    if (blobSha) blobUrlCache.set(blobSha, blobUrl);
    resolvedUrlCache.set(`${relPath}_${blobSha}`, inlineDataUrl || blobUrl);

    return {
      path: relPath,
      blobSha,
      mime,
      instantUrl: inlineDataUrl || blobUrl,
      inlineDataUrl
    };
  }

  /* Мгновенное разрешение URL с постоянным кэшированием в памяти сессии */
  async function resolveAssetUrl(pathOrUrl, blobSha, mime = "image/jpeg", inlineDataUrl = "") {
    if (inlineDataUrl && inlineDataUrl.startsWith("data:")) {
      return inlineDataUrl;
    }
    if (!pathOrUrl && !blobSha) return "";
    if (pathOrUrl && (pathOrUrl.startsWith("data:") || pathOrUrl.startsWith("blob:") || pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://"))) {
      return pathOrUrl;
    }
    if (blobSha && blobUrlCache.has(blobSha)) {
      return blobUrlCache.get(blobSha);
    }

    const cacheKey = `${pathOrUrl || ""}_${blobSha || ""}`;
    if (resolvedUrlCache.has(cacheKey)) {
      return resolvedUrlCache.get(cacheKey);
    }

    const repo = getRepo();
    const isAudio = mime.startsWith("audio/") || (pathOrUrl && pathOrUrl.startsWith("audio/"));

    if (isAudio && pathOrUrl) {
      const cleanPath = pathOrUrl.replace(/^\.?\//, "");
      const ref = lastKnownCommitSha || detectedBranch || "main";
      const streamUrl = `https://raw.githubusercontent.com/${repo}/${ref}/${cleanPath}`;
      resolvedUrlCache.set(cacheKey, streamUrl);
      return streamUrl;
    }

    if (blobSha) {
      try {
        const tk = getToken();
        const headers = { "Accept": "application/vnd.github+json" };
        if (tk) headers["Authorization"] = `Bearer ${tk}`;
        const res = await fetch(`https://api.github.com/repos/${repo}/git/blobs/${blobSha}`, {
          headers
        });
        if (res.ok) {
          const data = await res.json();
          if (data.content) {
            const bytes = base64ToUint8Array(data.content);
            const blob = new Blob([bytes], { type: mime });
            const objUrl = URL.createObjectURL(blob);
            blobUrlCache.set(blobSha, objUrl);
            resolvedUrlCache.set(cacheKey, objUrl);
            return objUrl;
          }
        }
      } catch {}
    }

    if (pathOrUrl) {
      const cleanPath = pathOrUrl.replace(/^\.?\//, "");
      const ref = lastKnownCommitSha || detectedBranch || "main";
      const rawUrl = `https://raw.githubusercontent.com/${repo}/${ref}/${cleanPath}`;
      resolvedUrlCache.set(cacheKey, rawUrl);
      return rawUrl;
    }

    return pathOrUrl;
  }

  /* Фоновый прогрев ссылок на постер и музыку при наведении мыши на карточку */
  function prefetchItemAssets(item) {
    if (!item) return;
    if (!item.posterInline && (item.poster || item.posterBlobSha)) {
      resolveAssetUrl(item.poster, item.posterBlobSha, "image/jpeg", item.posterInline).catch(() => {});
    }
    if (item.bgmUrl || item.bgmBlobSha) {
      resolveAssetUrl(item.bgmUrl, item.bgmBlobSha, "audio/mpeg").catch(() => {});
    }
  }

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

    const branchInfo = await getLatestBranchCommitSha(true);
    if (branchInfo && branchInfo.commitSha && branchInfo.treeSha) {
      const blobRes = await fetch(`https://api.github.com/repos/${repo}/git/blobs`, {
        method: "POST",
        headers,
        body: JSON.stringify({ content: utf8ToBase64(jsonStr), encoding: "base64" })
      });

      if (blobRes.ok) {
        const newBlob = await blobRes.json();
        const treeEntries = [{
          path: FILE_PATH,
          mode: "100644",
          type: "blob",
          sha: newBlob.sha
        }];

        if (payloadObj.meta.bgImage && payloadObj.meta.bgBlobSha && !payloadObj.meta.bgImage.startsWith("http") && !payloadObj.meta.bgImage.startsWith("data:")) {
          treeEntries.push({
            path: payloadObj.meta.bgImage.replace(/^\.?\//, ""),
            mode: "100644",
            type: "blob",
            sha: payloadObj.meta.bgBlobSha
          });
        }

        (payloadObj.tiers || []).forEach(tier => {
          (tier.items || []).forEach(it => {
            if (it.poster && it.posterBlobSha && !it.poster.startsWith("http") && !it.poster.startsWith("data:") && !it.poster.startsWith("blob:")) {
              treeEntries.push({
                path: it.poster.replace(/^\.?\//, ""),
                mode: "100644",
                type: "blob",
                sha: it.posterBlobSha
              });
            }
            if (it.bgmUrl && it.bgmBlobSha && !it.bgmUrl.startsWith("http") && !it.bgmUrl.startsWith("data:") && !it.bgmUrl.startsWith("blob:")) {
              treeEntries.push({
                path: it.bgmUrl.replace(/^\.?\//, ""),
                mode: "100644",
                type: "blob",
                sha: it.bgmBlobSha
              });
            }
          });
        });

        const treeRes = await fetch(`https://api.github.com/repos/${repo}/git/trees`, {
          method: "POST",
          headers,
          body: JSON.stringify({ base_tree: branchInfo.treeSha, tree: treeEntries })
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
              body: JSON.stringify({ sha: createdCommit.sha, force: true })
            });
            if (refRes.ok) {
              lastKnownCommitSha = createdCommit.sha;
              cachedBranchInfo = { commitSha: createdCommit.sha, treeSha: newTree.sha };
              cachedBranchInfoTime = Date.now();
              fetch(`https://purge.jsdelivr.net/gh/${repo}@${detectedBranch}/${FILE_PATH}`).catch(() => {});
              return createdCommit;
            }
          }
        }
      }
    }

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
    detectRepoFromLocation,
    isOwner,
    saveCredentials,
    verifyToken,
    fetchFreshTiersFromApi,
    fileToRawBase64,
    createInlineDataUrl,
    uploadAssetFile,
    resolveAssetUrl,
    prefetchItemAssets,
    commitTiersToGitHub,
    logout
  };
})();
