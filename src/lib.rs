use std::collections::HashSet;

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
    #[serde(rename = "viewedEpisodes")]
    pub viewed_episodes: i32,
    #[serde(rename = "viewedMovies")]
    pub viewed_movies: i32,
    #[serde(rename = "viewedMinutes")]
    pub viewed_minutes: f64,
    #[serde(rename = "viewedHours")]
    pub viewed_hours: f64,
    #[serde(rename = "rewatchCount")]
    pub rewatch_count: i32,
}

fn compute_item_metrics(item: &AnimeItem) -> ComputedMetrics {
    let mut seen_titles = HashSet::new();

    let mut total_episodes = 0;
    let mut total_movies = 0;
    let mut total_minutes = 0.0;

    let mut viewed_episodes = 0;
    let mut viewed_movies = 0;
    let mut viewed_minutes = 0.0;
    let mut rewatch_count = 0;

    if let Some(seasons) = &item.seasons {
        for s in seasons {
            let eps = s.episodes.unwrap_or(0).max(0);
            let p_type = s.part_type.as_deref().unwrap_or("TV Сериал");
            let default_min = if p_type == "Фильм" { 110.0 } else { 24.0 };
            let mins = s.ep_minutes.unwrap_or(default_min).max(0.0);

            if eps > 0 {
                let key = format!(
                    "{}::{}",
                    p_type.trim().to_lowercase(),
                    s.title.as_deref().unwrap_or("").trim().to_lowercase()
                );
                let is_rewatch = !seen_titles.insert(key);
                let part_mins = (eps as f64) * mins;

                viewed_minutes += part_mins;
                if p_type == "Фильм" {
                    viewed_movies += eps;
                } else {
                    viewed_episodes += eps;
                }

                if !is_rewatch {
                    total_minutes += part_mins;
                    if p_type == "Фильм" {
                        total_movies += eps;
                    } else {
                        total_episodes += eps;
                    }
                } else {
                    rewatch_count += 1;
                }
            }
        }
    }

    let total_hours = total_minutes / 60.0;
    let total_days = total_hours / 24.0;
    let viewed_hours = viewed_minutes / 60.0;

    ComputedMetrics {
        total_episodes,
        total_movies,
        total_minutes,
        total_hours,
        total_days,
        viewed_episodes,
        viewed_movies,
        viewed_minutes,
        viewed_hours,
        rewatch_count,
    }
}
