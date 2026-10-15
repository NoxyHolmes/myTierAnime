/* ═══════════════════ GITHUB REST API v3: INSTANT AUTO-SAVE & IMAGE COMPRESSOR ═══════════════════ */
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
    return !!getToken() && document.body.classList.contains("is-owner");
  }

  function saveCredentials(token, repo) {
    if (token) localStorage.setItem(TOKEN_KEY, token.trim());
    else localStorage.removeItem(TOKEN_KEY);
    if (repo) localStorage.setItem(REPO_KEY, repo.trim());
  }

  function utf8ToBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }

  function base64ToUtf8(b64) {
    return decodeURIComponent(escape(atob(b64.replace(/\s/g, ""))));
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

  /* Мгновенное сжатие картинки на клиенте (DataURL), чтобы фон менялся за 0.05 секунды! */
  function compressImageToDataUrl(file, maxW = 1600, quality = 0.8) {
    return new Promise((resolve, reject) => {
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
          resolve(cv.toDataURL("image/jpeg", quality));
        };
        img.onerror = reject;
        img.src = e.target.result;
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
      return { login: "Owner" };
    }
  }

  /* Чтение самого свежего файла напрямую из GitHub API (в обход кэша GitHub Pages!) */
  async function fetchFreshTiersFromApi() {
    const repo = getRepo();
    const tk = getToken();
    const headers = { "Accept": "application/vnd.github+json" };
    if (tk) headers["Authorization"] = `Bearer ${tk}`;

    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${FILE_PATH}?t=${Date.now()}`, {
      headers,
      cache: "no-store"
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.content) return null;
    return JSON.parse(base64ToUtf8(json.content));
  }

  async function uploadAssetFile(file, folder = "posters") {
    const tk = getToken();
    const repo = getRepo();
    if (!tk) throw new Error("Токен не задан");
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
      throw new Error(errJson.message || `Ошибка загрузки (${putRes.status})`);
    }
    return relPath;
  }

  async function commitTiersToGitHub(payloadObj, commitMsg = "Instant auto-save via myTierAnime") {
    const tk = getToken();
    const repo = getRepo();
    if (!tk) return null;

    const apiUrl = `https://api.github.com/repos/${repo}/contents/${FILE_PATH}`;
    const headers = {
      "Authorization": `Bearer ${tk}`,
      "Accept": "application/vnd.github+json",
      "Content-Type": "application/json"
    };

    let sha = undefined;
    const getRes = await fetch(`${apiUrl}?t=${Date.now()}`, { headers, cache: "no-store" });
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
    fetchFreshTiersFromApi,
    compressImageToDataUrl,
    uploadAssetFile,
    commitTiersToGitHub,
    logout
  };
})();
