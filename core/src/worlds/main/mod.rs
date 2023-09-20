use voxelize::{FlatlandStage, Registry, World, WorldConfig};

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

    world
}
