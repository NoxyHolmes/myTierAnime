/* ═══════════════════ GITHUB REST API v3 TOKEN AUTH & CLOUD COMMIT ═══════════════════ */
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

  function saveCredentials(token, repo) {
    if (token) localStorage.setItem(TOKEN_KEY, token.trim());
    else localStorage.removeItem(TOKEN_KEY);
    if (repo) localStorage.setItem(REPO_KEY, repo.trim());
  }

  function utf8ToBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }

  async function verifyToken(token) {
    const tk = (token ?? getToken()).trim();
    if (!tk) return null;
    try {
      const res = await fetch("https://api.github.com/user", {
        headers: {
          "Authorization": `Bearer ${tk}`,
          "Accept": "application/vnd.github+json"
        }
      });
      if (!res.ok) return null;
      const data = await res.json();
      verifiedUser = data;
      return data;
    } catch (err) {
      console.warn("GitHub token verification error:", err);
      return null;
    }
  }

  async function commitTiersToGitHub(payloadObj, commitMsg = "Update data/tiers.json via myTierAnime 2026 UI") {
    const tk = getToken();
    const repo = getRepo();
    if (!tk) throw new Error("Токен владельца не задан.");

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
    saveCredentials,
    verifyToken,
    commitTiersToGitHub,
    logout
  };
})();
