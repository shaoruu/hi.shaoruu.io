use voxelize::{Registry, World, WorldConfig};

use super::shared::{
    client::setup_client, components::setup_components, entities::setup_entities, kdtree,
    methods::setup_methods, stage::LimitedStage, systems::setup_dispatcher,
};

pub fn setup_terrain_world(registry: &Registry) -> World {
    let config = WorldConfig::new()
        .preload(true)
        .min_chunk([-50, -50])
        .max_chunk([50, 50])
        .time_per_day(2400)
        .default_time(1200.0)
        .max_updates_per_tick(100)
        .build();

    let mut world = World::new("terrain", &config);

    world.ecs_mut().insert(kdtree::KdTree::new());

    setup_components(&mut world);
    setup_entities(&mut world);
    setup_dispatcher(&mut world);
    setup_methods(&mut world);
    setup_client(&mut world);

    {
        let mut pipeline = world.pipeline_mut();
        pipeline.add_stage(LimitedStage)
    }

    world
}
