/* ═══════════════════ GITHUB REST API v3: STRICT OWNER AUTH & IMAGE UPLOAD ═══════════════════ */
const GitHubSync = (() => {
  const TOKEN_KEY = "mta_2026_gh_token";
  const REPO_KEY  = "mta_2026_gh_repo";
  const DEFAULT_REPO = "geraltschwarzenegger-svg/myTierAnime";
  const FILE_PATH = "data/tiers.json";

  let verifiedUser = null;

  function getToken() {
    return localStorage.getItem(TOKEN_KEY) || "";
  }

  function getRepo() {
    return localStorage.getItem(REPO_KEY) || DEFAULT_REPO;
  }

  function isOwner() {
    return !!verifiedUser && document.body.classList.contains("is-owner");
  }

  function saveCredentials(token, repo) {
    if (token) localStorage.setItem(TOKEN_KEY, token.trim());
    else localStorage.removeItem(TOKEN_KEY);
    if (repo) localStorage.setItem(REPO_KEY, repo.trim());
  }

  function utf8ToBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const res = String(reader.result || "");
        const base64 = res.includes(",") ? res.split(",")[1] : res;
        resolve({ base64, dataUrl: res });
      };
      reader.onerror = reject;
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
      const res = await fetch("https://api.github.com/user", {
        headers: {
          "Authorization": `Bearer ${tk}`,
          "Accept": "application/vnd.github+json"
        }
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
      verifiedUser = null;
      return null;
    }
  }

  /* Загрузка файла обложки в папку posters/ или фона в папку backgrounds/ */
  async function uploadAssetFile(file, folder = "posters") {
    if (!isOwner()) throw new Error("Только владелец может загружать файлы.");
    const tk = getToken();
    const repo = getRepo();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const relPath = `${folder}/${Date.now()}_${safeName}`;
    const { base64 } = await fileToBase64(file);

    const apiUrl = `https://api.github.com/repos/${repo}/contents/${relPath}`;
    const headers = {
      "Authorization": `Bearer ${tk}`,
      "Accept": "application/vnd.github+json",
      "Content-Type": "application/json"
    };

    const putRes = await fetch(apiUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `Upload ${relPath} via myTierAnime UI`,
        content: base64
      })
    });

    if (!putRes.ok) {
      const errJson = await putRes.json().catch(() => ({}));
      throw new Error(errJson.message || `Ошибка загрузки файла (${putRes.status})`);
    }
    return relPath;
  }

  async function commitTiersToGitHub(payloadObj, commitMsg = "Update data/tiers.json via myTierAnime UI") {
    if (!isOwner()) throw new Error("Необходим вход владельца по токену GitHub.");
    const tk = getToken();
    const repo = getRepo();

    const apiUrl = `https://api.github.com/repos/${repo}/contents/${FILE_PATH}`;
    const headers = {
      "Authorization": `Bearer ${tk}`,
      "Accept": "application/vnd.github+json",
      "Content-Type": "application/json"
    };

    let sha = undefined;
    const getRes = await fetch(apiUrl, { headers });
    if (getRes.ok) {
      const existing = await getRes.json();
      sha = existing.sha;
    }

    payloadObj.meta = payloadObj.meta || {};
    payloadObj.meta.updatedAt = new Date().toISOString();
    const jsonStr = JSON.stringify(payloadObj, null, 2);
    const body = {
      message: commitMsg,
      content: utf8ToBase64(jsonStr)
    };
    if (sha) body.sha = sha;

    const putRes = await fetch(apiUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify(body)
    });

    if (!putRes.ok) {
      const errJson = await putRes.json().catch(() => ({}));
      throw new Error(errJson.message || `Ошибка GitHub API (${putRes.status})`);
    }
    return await putRes.json();
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
    uploadAssetFile,
    commitTiersToGitHub,
    logout
  };
})();
