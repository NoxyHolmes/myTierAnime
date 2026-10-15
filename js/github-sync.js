/* ═══════════════════ GITHUB REST API v3: AUTO-REPO DETECTION & LIVE RAW SYNC ═══════════════════ */
const GitHubSync = (() => {
  const TOKEN_KEY = "mta_2026_gh_token";
  const REPO_KEY  = "mta_2026_gh_repo";
  const DEFAULT_REPO = "geraltschwarzenegger-svg/myTierAnime";
  const FILE_PATH = "data/tiers.json";

  let verifiedUser = null;

  /* Автоматически определяет owner/repo прямо из публичной ссылки GitHub Pages! */
  function detectRepoFromLocation() {
    try {
      const host = window.location.hostname; // например: username.github.io
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

  /* МГНОВЕННОЕ ПОЛУЧЕНИЕ АКТУАЛЬНОЙ БАЗЫ ДЛЯ ВСЕХ ГОСТЕЙ ПО ССЫЛКЕ (БЕЗ КЭША И ОГРАНИЧЕНИЙ РАЗМЕРА) */
  async function fetchFreshTiersFromApi() {
    const repo = getRepo();
    const tk = getToken();

    // 1. Запрос через GitHub API в режиме RAW (обходит 1MB лимит и кеш GitHub Pages, обновляется за 0.5 сек)
    try {
      const headers = { "Accept": "application/vnd.github.raw+json" };
      if (tk) headers["Authorization"] = `Bearer ${tk}`;
      const res = await fetch(`https://api.github.com/repos/${repo}/contents/${FILE_PATH}?t=${Date.now()}`, {
        headers,
        cache: "no-store"
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Primary API raw fetch fallback:", e);
    }

    // 2. Резервный запрос стандартного JSON объекта GitHub API
    try {
      const headers = { "Accept": "application/vnd.github+json" };
      if (tk) headers["Authorization"] = `Bearer ${tk}`;
      const res2 = await fetch(`https://api.github.com/repos/${repo}/contents/${FILE_PATH}?t=${Date.now()}`, {
        headers,
        cache: "no-store"
      });
      if (res2.ok) {
        const metaJson = await res2.json();
        if (metaJson.content) {
          return JSON.parse(base64ToUtf8(metaJson.content));
        }
      }
    } catch {}

    // 3. Второй резервный канал с принудительным сбросом кэша заголовками
    try {
      const res3 = await fetch(`data/tiers.json?nocache=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache"
        }
      });
      if (res3.ok) return await res3.json();
    } catch {}

    return null;
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
    payloadObj.meta.repo = repo;
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
