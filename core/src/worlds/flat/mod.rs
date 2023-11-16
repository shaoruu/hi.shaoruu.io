mod stage;

use voxelize::{FlatlandStage, Registry, World, WorldConfig};

use self::stage::GridLandStage;

use super::shared::{
    components::setup_components, entities::setup_entities, kdtree, methods::setup_methods,
    systems::setup_dispatcher,
};

pub fn setup_flat_world(registry: &Registry) -> World {
    let config = WorldConfig::new()
        .preload(true)
        .min_chunk([-50, -50])
        .max_chunk([50, 50])
        .time_per_day(2400)
        .max_updates_per_tick(100)
        .build();

    let mut world = World::new("flat", &config);

    world.ecs_mut().insert(kdtree::KdTree::new());

    setup_components(&mut world);
    setup_entities(&mut world);
    setup_dispatcher(&mut world);
    setup_methods(&mut world);

    {
        let mut pipeline = world.pipeline_mut();
        pipeline.add_stage(GridLandStage::new().add_soiling(52, 10).set_grid(10, 51))
    }

    world
}
