pub fn get_preload_radius() -> usize {
    if std::env::var("CARGO_ENV").unwrap_or_default() == "production" {
        6
    } else {
        2
    }
}
