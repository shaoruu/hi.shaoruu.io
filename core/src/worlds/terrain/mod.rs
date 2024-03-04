mod soiling;
mod tree;

use voxelize::{
    BaseTerrainStage, Biome, LSystem, NoiseOptions, Registry, Terrain, TerrainLayer, Tree, Trees,
    World, WorldConfig,
};

use self::{soiling::SoilingStage, tree::TreeStage};

use super::shared::{
    client::setup_client, components::setup_components, entities::setup_entities, kdtree,
    methods::setup_methods, stage::LimitedStage, systems::setup_dispatcher,
};

use std::f64;

pub const MOUNTAIN_HEIGHT: f64 = 1.0;
pub const RIVER_HEIGHT: f64 = 0.25;
pub const PLAINS_HEIGHT: f64 = 0.347;
pub const RIVER_WIDTH: f64 = 0.36;

pub fn setup_terrain_world(registry: &Registry) -> World {
    let config = WorldConfig::new()
        .terrain(
            &NoiseOptions::new()
                .frequency(0.005)
                .octaves(8)
                .persistence(0.5)
                .lacunarity(1.8623123)
                .build(),
        )
        .preload(true)
        .preload_radius(2)
        .max_chunk([31, 31])
        .min_chunk([-32, -32])
        .default_time(1200.0)
        .time_per_day(2400)
        .seed(4213)
        .build();

    let mut world = World::new("terrain", &config);

    let mut terrain = Terrain::new(&config);

    // The base shape of the terrain:
    // The more extreme (far from 0) the value, the more mountainous the terrain will be.
    // The closer to 0, the more plains-like the terrain will be.
    let continentalness = TerrainLayer::new(
        "continentalness",
        &NoiseOptions::new()
            .frequency(0.0005)
            .octaves(7)
            .persistence(0.52)
            .lacunarity(2.3)
            .seed(1231252)
            .build(),
    )
    .add_bias_points(&[[-1.0, 3.5], [0.0, 3.0], [0.4, 5.0], [1.0, 8.5]])
    .add_offset_points(&[
        [-2.9, MOUNTAIN_HEIGHT],
        [-0.5, PLAINS_HEIGHT + 0.01],
        [0.0, PLAINS_HEIGHT],
        // [RIVER_WIDTH, PLAINS_HEIGHT],
        // [0.0, PLAINS_HEIGHT],
        [1.1, RIVER_HEIGHT],
        [2.8, 0.0],
        [4.6, MOUNTAIN_HEIGHT], // [5.7, MOUNTAIN_HEIGHT],
    ]);

    // // The peaks and valleys of the terrain:
    // // The higher the value, the more mountainous the terrain will be.
    // // The lower the value, the more plains-like the terrain will be.
    let peaks_and_valleys = TerrainLayer::new(
        "peaks_and_valleys",
        &NoiseOptions::new()
            .frequency(0.002)
            .octaves(7)
            .persistence(0.53)
            .lacunarity(2.0)
            .seed(51287)
            .build(),
    )
    .add_bias_points(&[[-1.0, 3.5], [1.0, 3.5]])
    .add_offset_points(&[
        [-3.0, RIVER_HEIGHT],
        [-2.0, PLAINS_HEIGHT],
        [-0.4, PLAINS_HEIGHT * 0.9],
        [0.0, RIVER_HEIGHT],
        [RIVER_WIDTH / 2.0, RIVER_HEIGHT * 1.05],
        [2.0, PLAINS_HEIGHT + RIVER_HEIGHT],
        [5.0, MOUNTAIN_HEIGHT * 2.0],
    ]);

    let erosion = TerrainLayer::new(
        "erosion",
        &NoiseOptions::new()
            .frequency(0.01)
            .octaves(7)
            .persistence(0.5)
            .lacunarity(1.9)
            .seed(1233)
            .build(),
    )
    .add_bias_points(&[[-1.0, 3.5], [1.0, 3.5]])
    .add_offset_points(&[[-1.0, MOUNTAIN_HEIGHT], [1.0, RIVER_HEIGHT / 2.0]]);

    terrain.add_layer(&continentalness, 1.0);
    terrain.add_layer(&peaks_and_valleys, 0.5);
    terrain.add_noise_layer(&erosion, 0.015);

    // ●	Continentalness (weight: 1.7)
    //  ●	1.0: Low terrain, most likely water
    //  ●	0.0: Shores between plains and water
    //  ●	-1.0: Land, from plains to high mountains
    // ●	Peaks and Valleys (weight: 1.0)
    //  ●	1.0: Mountains, quite drastic
    //  ●	0.0: Water, shore, rivers
    //  ●	-1.0: Plains, flatland
    // ●	Erosion (weight: 0.3)
    //  ●	1.0: Low, shores or sea.
    //  ●	0.0: Land, mountainous
    //  ●	-1.0: Mountain peaks

    let cap = 0.2;

    terrain.add_biome(&[0.0, 0.0, 0.0], Biome::new("Biome 0", "Biome Test 0"));

    terrain.add_biome(&[0.0, 0.0, cap], Biome::new("Biome 1", "Biome Test 1"));
    terrain.add_biome(&[0.0, cap, 0.0], Biome::new("Biome 2", "Biome Test 2"));
    terrain.add_biome(&[0.0, cap, cap], Biome::new("Biome 3", "Biome Test 3"));
    terrain.add_biome(&[cap, 0.0, 0.0], Biome::new("Biome 4", "Biome Test 4"));
    terrain.add_biome(&[cap, 0.0, cap], Biome::new("Biome 5", "Biome Test 5"));
    terrain.add_biome(&[cap, cap, 0.0], Biome::new("Biome 6", "Biome Test 6"));
    terrain.add_biome(&[cap, cap, cap], Biome::new("Biome 7", "Biome Test 7"));

    terrain.add_biome(&[0.0, 0.0, -cap], Biome::new("Biome 8", "Biome Test 8"));
    terrain.add_biome(&[0.0, -cap, 0.0], Biome::new("Biome 9", "Biome Test 9"));
    terrain.add_biome(&[0.0, -cap, -cap], Biome::new("Biome 10", "Biome Test 10"));
    terrain.add_biome(&[-cap, 0.0, 0.0], Biome::new("Biome 11", "Biome Test 11"));
    terrain.add_biome(&[-cap, 0.0, -cap], Biome::new("Biome 12", "Biome Test 12"));
    terrain.add_biome(&[-cap, -cap, 0.0], Biome::new("Biome 13", "Biome Test 13"));
    terrain.add_biome(&[-cap, -cap, -cap], Biome::new("Biome 14", "Biome Test 14"));

    terrain.add_biome(&[cap, cap, -cap], Biome::new("Biome 15", "Biome Test 15"));
    terrain.add_biome(&[cap, -cap, cap], Biome::new("Biome 16", "Biome Test 16"));
    terrain.add_biome(&[cap, -cap, -cap], Biome::new("Biome 17", "Biome Test 17"));
    terrain.add_biome(&[-cap, cap, cap], Biome::new("Biome 18", "Biome Test 18"));
    terrain.add_biome(&[-cap, cap, -cap], Biome::new("Biome 19", "Biome Test 19"));
    terrain.add_biome(&[-cap, -cap, cap], Biome::new("Biome 20", "Biome Test 20"));

    {
        let mut pipeline = world.pipeline_mut();

        let mut terrain_stage = BaseTerrainStage::new(terrain);
        terrain_stage.set_base(2);
        terrain_stage.set_threshold(0.0);

        pipeline.add_stage(terrain_stage);

        pipeline.add_stage(SoilingStage::new(
            config.seed,
            &NoiseOptions::new().frequency(0.04).lacunarity(1.6).build(),
        ));

        let mut tiny_trees = Trees::new(
            config.seed,
            &NoiseOptions::new()
                .frequency(0.4)
                .lacunarity(2.9)
                .seed(123123)
                .build(),
        );
        tiny_trees.set_threshold(3.5);

        let palm = Tree::new(5004, 5003)
            .leaf_height(2)
            .leaf_radius(1)
            .branch_initial_radius(1)
            .branch_initial_length(6)
            .branch_dy_angle(f64::consts::PI / 4.0)
            .branch_drot_angle(f64::consts::PI / 4.0)
            .system(LSystem::new().axiom("F%[F%]").iterations(1).build())
            .build();

        tiny_trees.register("Tiny", palm);

        let mut oak_trees = Trees::new(
            config.seed,
            &NoiseOptions::new()
                .frequency(0.36)
                .lacunarity(2.9)
                .seed(532874)
                .build(),
        );
        oak_trees.set_threshold(4.5);
        let oak = Tree::new(5004, 5003)
            .leaf_height(3)
            .leaf_radius(3)
            .branch_initial_radius(3)
            .branch_initial_length(7)
            .branch_radius_factor(0.8)
            .branch_length_factor(0.5)
            .branch_dy_angle(f64::consts::PI / 4.0)
            .branch_drot_angle(f64::consts::PI * 2.0 / 7.0)
            .system(
                LSystem::new()
                    .axiom("A")
                    .rule('A', "FF[[#B]++[#B]++[#B]++[#B]]+%!A")
                    .rule('B', "%F#@%B")
                    .iterations(4)
                    .build(),
            )
            .build();

        oak_trees.register("Oak", oak);

        let mut boulder_trees = Trees::new(
            config.seed,
            &NoiseOptions::new()
                .frequency(0.15)
                .lacunarity(2.9)
                .seed(4716384)
                .build(),
        );
        boulder_trees.set_threshold(4.5);
        let boulder = Tree::new(2, 0)
            .leaf_height(3)
            .leaf_radius(3)
            .branch_initial_radius(2)
            .branch_initial_length(7)
            .branch_radius_factor(0.8)
            .branch_length_factor(0.5)
            .branch_dy_angle(f64::consts::PI / 4.0)
            .branch_drot_angle(f64::consts::PI * 2.0 / 7.0)
            .system(LSystem::new().axiom("%").iterations(0).build())
            .build();

        boulder_trees.register("Boulder", boulder);

        let mut mystical_trees = Trees::new(
            config.seed,
            &NoiseOptions::new()
                .frequency(0.25)
                .lacunarity(3.0)
                .seed(8675309)
                .build(),
        );
        mystical_trees.set_threshold(5.0); // A bit more selective in tree placement

        // L-System rules:
        // - F: branch out
        // - #: branch rotation increase
        // - $: branch rotation decrease
        // - +: branch axis-rotation increase
        // - -: branch axis rotation decrease
        // - @: branch length *= factor
        // - !: branch radius *= factor
        // - %: place leaves at end of branch
        // - [: push a new state
        // - ]: pop back to previous state
        let mystical = Tree::new(202, 57)
            .leaf_height(3) // Increased leaf height for a fuller look
            .leaf_radius(3) // Larger leaves for a more mystical appearance
            .branch_initial_radius(3) // Thicker initial branches for a sturdier look
            .branch_initial_length(7) // Longer initial branches for a grander scale
            .branch_radius_factor(0.9) // Slightly less tapering for the branches
            .branch_length_factor(0.65) // Longer branches overall
            .branch_dy_angle(f64::consts::PI / 5.0) // Adjusted angle for a more spread out look
            .branch_drot_angle(f64::consts::PI / 5.0) // Changed rotation angle for variety
            .system(
                LSystem::new()
                    .axiom("X")
                    .rule('X', "FF$[B]+$[B]+$[B]FFFF")
                    .rule('B', "F!$@!F$F%")
                    .iterations(8) // Increased iterations for a more intricate structure
                    .build(),
            )
            .build();
        mystical_trees.register("Mystical", mystical);

        let tree_stage = TreeStage::new()
            .with(oak_trees, "Oak")
            .with(tiny_trees, "Tiny")
            .with(boulder_trees, "Boulder")
            .with(mystical_trees, "Mystical");
        // .with(ancient_trees, "Ancient");

        pipeline.add_stage(tree_stage);
    }

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
