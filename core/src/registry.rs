use voxelize::{Block, Registry};

pub fn get_registry() -> Registry {
    let mut registry = Registry::new();

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

    registry.register_blocks(&[
        Block::new("Sapphire").id(300).build(),
        Block::new("Emerald").id(301).build(),
        Block::new("Ruby").id(302).build(),
        Block::new("Turquoise").id(303).build(),
        Block::new("Amethyst").id(304).build(),
        Block::new("Jade").id(305).build(),
        Block::new("Coral").id(306).build(),
        Block::new("Lapis Lazuli").id(307).build(),
        Block::new("Malachite").id(308).build(),
        Block::new("Pyrite").id(309).build(),
        Block::new("Flint").id(310).build(),
        Block::new("Moonstone").id(311).build(),
        Block::new("Aquamarine").id(312).build(),
        Block::new("Sunstone").id(313).build(),
        Block::new("Opal").id(314).build(),
        Block::new("Bloodstone").id(315).build(),
        Block::new("Rose Quartz").id(316).build(),
        Block::new("Iolite").id(317).build(),
        Block::new("Hematite").id(318).build(),
        Block::new("Azurite").id(319).build(),
    ]);

    registry
}
