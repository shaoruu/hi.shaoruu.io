mod entities;
mod stage;

use serde::{Deserialize, Serialize};
use voxelize::{Registry, World, WorldConfig};

use self::{entities::setup_entities, stage::LimitedStage};

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
        .max_updates_per_tick(100)
        .build();

    let mut world = World::new("main", &config);

    setup_entities(&mut world);

    {
        let mut pipeline = world.pipeline_mut();
        pipeline.add_stage(LimitedStage)
    }

    world.set_method_handle("time", |world, _, payload| {
        let time_per_day = world.config().time_per_day as f32;
        let new_time: TimeMethodPayload = serde_json::from_str(&payload).unwrap();
        world.stats_mut().set_time(new_time.time % time_per_day);
    });

    world
}
