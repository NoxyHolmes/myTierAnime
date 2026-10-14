/* ═══════════════════ SHIKIMORI & JIKAN ANIME AUTOCOMPLETE API ═══════════════════ */
const AnimeSearchAPI = (() => {
  let abortCtrl = null;

  async function searchAnime(query) {
    if (!query || query.trim().length < 2) return [];
    if (abortCtrl) abortCtrl.abort();
    abortCtrl = new AbortController();

    const q = encodeURIComponent(query.trim());
    try {
      // Primary: Shikimori Russian/Original DB
      const res = await fetch(`https://shikimori.one/api/animes?search=${q}&limit=6&order=popularity`, {
        signal: abortCtrl.signal,
        headers: { "Accept": "application/json" }
      });
      if (!res.ok) throw new Error("Shikimori status " + res.status);
      const list = await res.json();
      return list.map(item => ({
        title: item.russian || item.name,
        origTitle: item.name,
        year: item.aired_on ? new Date(item.aired_on).getFullYear() : new Date().getFullYear(),
        episodes: (item.episodes || item.episodes_aired || 12) + " эп.",
        score: item.score ? parseFloat(item.score) : 8.5,
        poster: item.image?.original
          ? "https://shikimori.one" + item.image.original
          : "",
        studio: "Anime Studio",
        genres: ["Аниме", item.kind ? item.kind.toUpperCase() : "TV"]
      }));
    } catch (e) {
      if (e.name === "AbortError") return [];
      // Fallback: Jikan v4 (MyAnimeList)
      try {
        const jRes = await fetch(`https://api.jikan.moe/v4/anime?q=${q}&limit=5`, {
          signal: abortCtrl.signal
        });
        if (!jRes.ok) return [];
        const jData = await jRes.json();
        return (jData.data || []).map(item => ({
          title: item.title_english || item.title,
          origTitle: item.title,
          year: item.year || new Date().getFullYear(),
          episodes: (item.episodes || 12) + " эп.",
          score: item.score || 8.5,
          poster: item.images?.jpg?.large_image_url || "",
          studio: item.studios?.[0]?.name || "Studio",
          genres: (item.genres || []).slice(0, 3).map(g => g.name)
        }));
      } catch {
        return [];
      }
    }
  }

  return { searchAnime };
})();
