use serde::{Deserialize, Serialize};
use voxelize::{FlatlandStage, Registry, World, WorldConfig};

#[derive(Serialize, Deserialize, Debug)]
struct TimeMethodPayload {
    time: f32,
}

pub fn setup_main_world(registry: &Registry) -> World {
    let config = WorldConfig::new()
        .preload(true)
        .min_chunk([-50, -50])
        .max_chunk([50, 50])
        .saving(true)
        .save_dir("data/worlds/main")
        .time_per_day(2400)
        .build();

    let mut world = World::new("main", &config);

    {
        let mut pipeline = world.pipeline_mut();

        let stone = registry.get_block_by_name("stone");

        pipeline.add_stage(FlatlandStage::new().add_soiling(stone.id, 50))
    }

    world.set_method_handle("time", |world, _, payload| {
        let time_per_day = world.config().time_per_day as f32;
        let new_time: TimeMethodPayload = serde_json::from_str(&payload).unwrap();
        world.stats_mut().set_time(new_time.time % time_per_day);
    });

    world
}
