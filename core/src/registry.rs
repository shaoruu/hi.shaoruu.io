use voxelize::{Block, Registry};

pub fn get_registry() -> Registry {
    let mut registry = Registry::new();

    // Pure color blocks, no textures

    registry.register_blocks(&[
        Block::new("Dirt").id(1).build(),
        Block::new("Stone").id(2).build(),
        // Stones
        Block::new("Sand").id(50).build(),
        Block::new("Chalk").id(51).build(),
        Block::new("Quartzite").id(52).build(),
        Block::new("Limestone").id(53).build(),
        Block::new("Andersite").id(54).build(),
        Block::new("Basalt").id(55).build(),
        Block::new("Diorite").id(56).build(),
        Block::new("Gabbro").id(57).build(),
        Block::new("Tuff").id(58).build(),
        Block::new("Pumice").id(59).build(),
        Block::new("Scoria").id(60).build(),
        Block::new("Obsidian").id(61).build(),
        Block::new("Granite").id(62).build(),
        Block::new("Graphite").id(63).build(),
        Block::new("Marble").id(64).build(),
        // Rare Rocks
        Block::new("Blue Lace Agate").id(200).build(),
        Block::new("Onyx Agate").id(201).build(),
        Block::new("Moss Agate")
            .id(202)
            // .is_light(true)
            .red_light_level(4)
            .green_light_level(4)
            .blue_light_level(4)
            .is_transparent(true)
            .build(),
        Block::new("Condor Agate").id(203).build(),
        Block::new("Enhydro Agate").id(204).build(),
        Block::new("Sagenite Agate").id(205).build(),
        Block::new("Crazy Lace Agate").id(206).build(),
    ]);

    registry
}
