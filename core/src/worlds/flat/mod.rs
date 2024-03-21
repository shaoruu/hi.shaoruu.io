mod stage;

use voxelize::{FlatlandStage, Registry, World, WorldConfig};

use crate::constants::get_preload_radius;

use self::stage::GridLandStage;

use super::shared::{
    client::setup_client, components::setup_components, entities::setup_entities,
    methods::setup_methods, systems::setup_dispatcher,
};

pub fn setup_flat_world(registry: &Registry) -> World {
    let config = WorldConfig::new()
        .preload(true)
        .preload_radius(get_preload_radius())
        .min_chunk([-6, -6])
        .max_chunk([5, 5])
        .time_per_day(2400)
        .max_updates_per_tick(100)
        .saving(true)
        .save_dir("data/worlds/flat")
        .build();

    let mut world = World::new("flat", &config);

    setup_components(&mut world);
    setup_entities(&mut world);
    setup_dispatcher(&mut world);
    setup_methods(&mut world);
    setup_client(&mut world);

    {
        let mut pipeline = world.pipeline_mut();
        pipeline.add_stage(GridLandStage::new().add_soiling(2, 10).set_grid(10, 1))
    }

    world
}
