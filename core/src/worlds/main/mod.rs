mod components;
mod dispatcher;
mod entities;
mod methods;
mod stage;
mod systems;

use serde::{Deserialize, Serialize};
use voxelize::{Registry, World, WorldConfig};

use self::{
    components::setup_components, dispatcher::setup_dispatcher, entities::setup_entities,
    methods::setup_methods, stage::LimitedStage,
};

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

    setup_components(&mut world);
    setup_entities(&mut world);
    setup_dispatcher(&mut world);
    setup_methods(&mut world);

    {
        let mut pipeline = world.pipeline_mut();
        pipeline.add_stage(LimitedStage)
    }

    world
}
