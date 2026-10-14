/* ═══════════════════ SHIKIMORI & JIKAN ANIME AUTOCOMPLETE API ═══════════════════ */
const AnimeSearchAPI = (() => {
  let abortCtrl = null;

  function mapKindToRu(kind) {
    const k = String(kind || "").toLowerCase();
    if (k === "movie") return "Фильм";
    if (k === "ova") return "OVA";
    if (k === "ona") return "ONA";
    if (k === "special" || k === "tv_special") return "Спешл";
    return "TV Сериал";
  }

  async function searchAnime(query) {
    if (!query || query.trim().length < 2) return [];
    if (abortCtrl) abortCtrl.abort();
    abortCtrl = new AbortController();

    const q = encodeURIComponent(query.trim());
    try {
      const res = await fetch(`https://shikimori.one/api/animes?search=${q}&limit=6&order=popularity`, {
        signal: abortCtrl.signal,
        headers: { "Accept": "application/json" }
      });
      if (!res.ok) throw new Error("Shikimori status " + res.status);
      const list = await res.json();
      return list.map(item => {
        const kindRu = mapKindToRu(item.kind);
        return {
          title: item.russian || item.name,
          origTitle: item.name,
          kind: kindRu,
          year: item.aired_on ? new Date(item.aired_on).getFullYear() : new Date().getFullYear(),
          episodes: item.episodes || item.episodes_aired || (kindRu === "Фильм" ? 1 : 12),
          epMinutes: kindRu === "Фильм" ? 110 : 24,
          score: item.score ? parseFloat(item.score) : 8.5,
          poster: item.image?.original ? "https://shikimori.one" + item.image.original : "",
          studio: "Anime Studio",
          genres: ["Аниме", kindRu]
        };
      });
    } catch (e) {
      if (e.name === "AbortError") return [];
      try {
        const jRes = await fetch(`https://api.jikan.moe/v4/anime?q=${q}&limit=5`, { signal: abortCtrl.signal });
        if (!jRes.ok) return [];
        const jData = await jRes.json();
        return (jData.data || []).map(item => {
          const kindRu = mapKindToRu(item.type);
          return {
            title: item.title_english || item.title,
            origTitle: item.title,
            kind: kindRu,
            year: item.year || new Date().getFullYear(),
            episodes: item.episodes || (kindRu === "Фильм" ? 1 : 12),
            epMinutes: kindRu === "Фильм" ? 110 : 24,
            score: item.score || 8.5,
            poster: item.images?.jpg?.large_image_url || "",
            studio: item.studios?.[0]?.name || "Studio",
            genres: (item.genres || []).slice(0, 3).map(g => g.name)
          };
        });
      } catch {
        return [];
      }
    }
  }

  return { searchAnime };
})();
