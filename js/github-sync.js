/* ═══════════════════ GITHUB SYNC ENGINE v9.0 (POSTER TREE BINDING & BLOB RESOLVER) ═══════════════════ */
const GitHubSync = (() => {
  const TOKEN_KEY = "mta_2026_gh_token";
  const REPO_KEY  = "mta_2026_gh_repo";
  const FILE_PATH = "data/tiers.json";

  let verifiedUser = null;
  let detectedBranch = "main";
  let lastKnownCommitSha = "";
  const blobUrlCache = new Map();

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
    return "geraltschwarzenegger-svg/myTierAnime";
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY) || "";
  }

  function getRepo() {
    const saved = localStorage.getItem(REPO_KEY);
    const detected = detectRepoFromLocation();
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

  async function getLatestBranchCommitSha() {
    const repo = getRepo();
    const tk = getToken();
    const headers = { "Accept": "application/vnd.github+json" };
    if (tk) headers["Authorization"] = `Bearer ${tk}`;

    for (const br of [detectedBranch, "main", "master"]) {
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}/commits/${br}?_ya_bust=${Date.now()}_${Math.random()}`, {
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

  async function fetchFreshTiersFromApi() {
    const repo = getRepo();
    const tk = getToken();
    const headers = { "Accept": "application/vnd.github+json" };
    if (tk) headers["Authorization"] = `Bearer ${tk}`;

    const candidates = [];

    try {
      const branchInfo = await getLatestBranchCommitSha();
      if (branchInfo && branchInfo.commitSha) {
        try {
          const rawRes = await fetch(`https://raw.githubusercontent.com/${repo}/${branchInfo.commitSha}/${FILE_PATH}?_ya=${Date.now()}`, {
            cache: "no-store"
          });
          if (rawRes.ok) {
            const parsed = await rawRes.json();
            lastKnownCommitSha = branchInfo.commitSha;
            candidates.push(parsed);
          }
        } catch {}

        if (candidates.length === 0 && branchInfo.treeSha) {
          const treeRes = await fetch(`https://api.github.com/repos/${repo}/git/trees/${branchInfo.treeSha}?recursive=1&_ya=${Date.now()}`, {
            headers,
            cache: "no-store"
          });
          if (treeRes.ok) {
            const treeData = await treeRes.json();
            const fileNode = (treeData.tree || []).find(n => n.path === FILE_PATH);
            if (fileNode && fileNode.sha) {
              const blobRes = await fetch(`https://api.github.com/repos/${repo}/git/blobs/${fileNode.sha}?_ya=${Date.now()}`, {
                headers,
                cache: "no-store"
              });
              if (blobRes.ok) {
                const blobData = await blobRes.json();
                if (blobData.content) {
                  lastKnownCommitSha = branchInfo.commitSha;
                  candidates.push(JSON.parse(base64ToUtf8(blobData.content)));
                }
              }
            }
          }
        }
      }
    } catch {}

    try {
      const cRes = await fetch(`https://api.github.com/repos/${repo}/contents/${FILE_PATH}?_ya_nocache=${Date.now()}`, {
        headers,
        cache: "no-store"
      });
      if (cRes.ok) {
        const cJson = await cRes.json();
        if (cJson.content) {
          candidates.push(JSON.parse(base64ToUtf8(cJson.content)));
        }
      }
    } catch {}

    try {
      const localRes = await fetch(`data/tiers.json?_ya_nocache=${Date.now()}_${Math.random()}`, {
        cache: "reload"
      });
      if (localRes.ok) {
        candidates.push(await localRes.json());
      }
    } catch {}

    if (!candidates.length) return null;
    candidates.sort((a, b) => Number(b?.meta?.revision || 0) - Number(a?.meta?.revision || 0));
    return candidates[0];
  }

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
      body: JSON.stringify({ content: base64, encoding: "base64" })
    });

    if (!blobRes.ok) {
      const err = await blobRes.json().catch(() => ({}));
      throw new Error(err.message || `Ошибка загрузки файла (${blobRes.status})`);
    }
    const createdBlob = await blobRes.json();
    const blobSha = createdBlob.sha;
    blobUrlCache.set(blobSha, blobUrl);

    return { path: relPath, blobSha, mime, instantUrl: blobUrl };
  }

  async function resolveAssetUrl(pathOrUrl, blobSha, mime = "image/jpeg") {
    if (!pathOrUrl && !blobSha) return "";
    if (blobSha && blobUrlCache.has(blobSha)) return blobUrlCache.get(blobSha);
    if (pathOrUrl && (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://") || pathOrUrl.startsWith("data:") || pathOrUrl.startsWith("blob:"))) {
      return pathOrUrl;
    }

    const repo = getRepo();
    if (blobSha) {
      try {
        const tk = getToken();
        const headers = { "Accept": "application/vnd.github+json" };
        if (tk) headers["Authorization"] = `Bearer ${tk}`;
        const res = await fetch(`https://api.github.com/repos/${repo}/git/blobs/${blobSha}?_ya=${Date.now()}`, {
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

    if (pathOrUrl) {
      const cleanPath = pathOrUrl.replace(/^\.?\//, "");
      const ref = lastKnownCommitSha || detectedBranch || "main";
      return `https://raw.githubusercontent.com/${repo}/${ref}/${cleanPath}?_ya=${Date.now()}`;
    }

    return pathOrUrl;
  }

  /* При коммите привязываем в Git Tree не только tiers.json и фон, но и ВСЕ загруженные обложки тайтлов (posterBlobSha)! */
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

    const branchInfo = await getLatestBranchCommitSha();
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

        // Привязываем фон сайта в дерево коммита
        if (payloadObj.meta.bgImage && payloadObj.meta.bgBlobSha && !payloadObj.meta.bgImage.startsWith("http")) {
          treeEntries.push({
            path: payloadObj.meta.bgImage.replace(/^\.?\//, ""),
            mode: "100644",
            type: "blob",
            sha: payloadObj.meta.bgBlobSha
          });
        }

        // Привязываем все загруженные обложки тайтлов в папку posters/ дерева репозитория!
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
    uploadAssetFile,
    resolveAssetUrl,
    commitTiersToGitHub,
    logout
  };
})();
