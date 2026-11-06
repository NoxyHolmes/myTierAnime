use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct SeasonPart {
    pub title: Option<String>,
    #[serde(rename = "type")]
    pub part_type: Option<String>,
    #[serde(rename = "releaseYear")]
    pub release_year: Option<i32>,
    pub episodes: Option<i32>,
    #[serde(rename = "epMinutes")]
    pub ep_minutes: Option<f64>,
    pub date: Option<String>,
    pub note: Option<String>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct AnimeItem {
    pub uid: String,
    #[serde(rename = "updatedAt")]
    pub updated_at: Option<u64>,
    pub kind: Option<String>,
    pub title: String,
    #[serde(rename = "origTitle")]
    pub orig_title: Option<String>,
    pub year: Option<serde_json::Value>,
    pub studio: Option<String>,
    pub studios: Option<Vec<String>>,
    pub poster: Option<String>,
    #[serde(rename = "posterBlobSha")]
    pub poster_blob_sha: Option<String>,
    #[serde(rename = "posterInline")]
    pub poster_inline: Option<String>,
    #[serde(rename = "bgmUrl")]
    pub bgm_url: Option<String>,
    #[serde(rename = "bgmBlobSha")]
    pub bgm_blob_sha: Option<String>,
    pub genres: Option<Vec<String>>,
    pub comment: Option<String>,
    pub seasons: Option<Vec<SeasonPart>>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Tier {
    pub id: String,
    pub rank: Option<i32>,
    pub name: String,
    pub subtitle: Option<String>,
    pub hue: Option<i32>,
    pub items: Vec<AnimeItem>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct AppState {
    pub meta: serde_json::Value,
    pub tiers: Vec<Tier>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ComputedMetrics {
    #[serde(rename = "totalEpisodes")]
    pub total_episodes: i32,
    #[serde(rename = "totalMovies")]
    pub total_movies: i32,
    #[serde(rename = "totalMinutes")]
    pub total_minutes: f64,
    #[serde(rename = "totalHours")]
    pub total_hours: f64,
    #[serde(rename = "totalDays")]
    pub total_days: f64,
}

/// 1. Автоматическая замена 3 и более пробелов подряд на ", "
#[wasm_bindgen]
pub fn normalize_triple_spaces(input: &str) -> String {
    let mut result = String::with_capacity(input.len());
    let mut space_count = 0;

    for ch in input.chars() {
        if ch == ' ' {
            space_count += 1;
        } else {
            if space_count >= 3 {
                result.push_str(", ");
            } else {
                for _ in 0..space_count {
                    result.push(' ');
                }
            }
            space_count = 0;
            result.push(ch);
        }
    }
    if space_count >= 3 {
        result.push_str(", ");
    } else {
        for _ in 0..space_count {
            result.push(' ');
        }
    }
    result
}

/// 2. Внутренний быстрый расчёт метрик одного тайтла на Rust
fn compute_item_metrics(item: &AnimeItem) -> ComputedMetrics {
    let mut total_episodes = 0;
    let mut total_movies = 0;
    let mut total_minutes = 0.0;

    if let Some(seasons) = &item.seasons {
        for s in seasons {
            let eps = s.episodes.unwrap_or(0).max(0);
            let p_type = s.part_type.as_deref().unwrap_or("TV Сериал");
            let default_min = if p_type == "Фильм" { 110.0 } else { 24.0 };
            let mins = s.ep_minutes.unwrap_or(default_min).max(0.0);

            if eps > 0 {
                total_minutes += (eps as f64) * mins;
                if p_type == "Фильм" {
                    total_movies += eps;
                } else {
                    total_episodes += eps;
                }
            }
        }
    }

    let total_hours = total_minutes / 60.0;
    let total_days = total_hours / 24.0;

    ComputedMetrics {
        total_episodes,
        total_movies,
        total_minutes,
        total_hours,
        total_days,
    }
}

/// 3. Экспорт расчёта метрик в JS
#[wasm_bindgen]
pub fn calc_item_metrics_wasm(item_json: &str) -> String {
    if let Ok(item) = serde_json::from_str::<AnimeItem>(item_json) {
        let m = compute_item_metrics(&item);
        serde_json::to_string(&m).unwrap_or_else(|_| "{}".to_string())
    } else {
        "{}".to_string()
    }
}

/// 4. Сортировка всех тиров по времени (от большего к меньшему, слева направо) на Rust
#[wasm_bindgen]
pub fn sort_tiers_by_time_wasm(state_json: &str) -> String {
    let mut state: AppState = match serde_json::from_str(state_json) {
        Ok(s) => s,
        Err(_) => return state_json.to_string(),
    };

    for tier in &mut state.tiers {
        tier.items.sort_by(|a, b| {
            let ma = compute_item_metrics(a);
            let mb = compute_item_metrics(b);

            mb.total_minutes
                .partial_cmp(&ma.total_minutes)
                .unwrap_or(std::cmp::Ordering::Equal)
                .then_with(|| mb.total_episodes.cmp(&ma.total_episodes))
                .then_with(|| a.title.to_lowercase().cmp(&b.title.to_lowercase()))
        });
    }

    serde_json::to_string(&state).unwrap_or_else(|_| state_json.to_string())
}
