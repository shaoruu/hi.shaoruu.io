use voxelize::{Block, BlockFace, BlockFaces, Registry, AABB};

pub fn get_registry() -> Registry {
    let slab_top_faces = BlockFaces::six_faces()
        .scale_y(0.5)
        .offset_y(0.5)
        .uv_offset_y(0.5)
        .uv_scale_y(0.5)
        .build();
    let slab_top_aabb = [AABB::new().scale_y(0.5).offset_y(0.5).build()];

    let slab_bottom_faces = BlockFaces::six_faces().scale_y(0.5).uv_scale_y(0.5).build();
    let slab_bottom_aabb = [AABB::new().scale_y(0.5).build()];

    let make_top_slab = |name: &str, id: u32| {
        Block::new(name)
            .id(id)
            .faces(&slab_top_faces)
            .aabbs(&slab_top_aabb)
            .is_transparent(true)
            .is_py_transparent(false)
            .build()
    };

    let make_bottom_slab = |name: &str, id: u32| {
        Block::new(name)
            .id(id)
            .faces(&slab_bottom_faces)
            .aabbs(&slab_bottom_aabb)
            .is_transparent(true)
            .is_ny_transparent(false)
            .build()
    };

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
        make_top_slab("Dirt Slab Top", 100),
        make_bottom_slab("Dirt Slab Bottom", 101),
        make_top_slab("Stone Slab Top", 102),
        make_bottom_slab("Stone Slab Bottom", 103),
        make_top_slab("Sand Slab Top", 104),
        make_bottom_slab("Sand Slab Bottom", 105),
        make_top_slab("Chalk Slab Top", 106),
        make_bottom_slab("Chalk Slab Bottom", 107),
        make_top_slab("Quartzite Slab Top", 108),
        make_bottom_slab("Quartzite Slab Bottom", 109),
        make_top_slab("Limestone Slab Top", 110),
        make_bottom_slab("Limestone Slab Bottom", 111),
        make_top_slab("Andersite Slab Top", 112),
        make_bottom_slab("Andersite Slab Bottom", 113),
        make_top_slab("Basalt Slab Top", 114),
        make_bottom_slab("Basalt Slab Bottom", 115),
        make_top_slab("Diorite Slab Top", 116),
        make_bottom_slab("Diorite Slab Bottom", 117),
        make_top_slab("Gabbro Slab Top", 118),
        make_bottom_slab("Gabbro Slab Bottom", 119),
        make_top_slab("Tuff Slab Top", 120),
        make_bottom_slab("Tuff Slab Bottom", 121),
        make_top_slab("Pumice Slab Top", 122),
        make_bottom_slab("Pumice Slab Bottom", 123),
        make_top_slab("Scoria Slab Top", 124),
        make_bottom_slab("Scoria Slab Bottom", 125),
        make_top_slab("Obsidian Slab Top", 126),
        make_bottom_slab("Obsidian Slab Bottom", 127),
        make_top_slab("Granite Slab Top", 128),
        make_bottom_slab("Granite Slab Bottom", 129),
        make_top_slab("Graphite Slab Top", 130),
        make_bottom_slab("Graphite Slab Bottom", 131),
        make_top_slab("Marble Slab Top", 132),
        make_bottom_slab("Marble Slab Bottom", 133),
        make_top_slab("Blue Lace Agate Slab Top", 134),
        make_bottom_slab("Blue Lace Agate Slab Bottom", 135),
        make_top_slab("Onyx Agate Slab Top", 136),
        make_bottom_slab("Onyx Agate Slab Bottom", 137),
        make_top_slab("Moss Agate Slab Top", 138),
        make_bottom_slab("Moss Agate Slab Bottom", 139),
        make_top_slab("Condor Agate Slab Top", 140),
        make_bottom_slab("Condor Agate Slab Bottom", 141),
        make_top_slab("Enhydro Agate Slab Top", 142),
        make_bottom_slab("Enhydro Agate Slab Bottom", 143),
        make_top_slab("Sagenite Agate Slab Top", 144),
        make_bottom_slab("Sagenite Agate Slab Bottom", 145),
        make_top_slab("Crazy Lace Agate Slab Top", 146),
        make_bottom_slab("Crazy Lace Agate Slab Bottom", 147),
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

    registry.register_blocks(&[
        make_top_slab("Sapphire Slab Top", 400),
        make_bottom_slab("Sapphire Slab Bottom", 401),
        make_top_slab("Emerald Slab Top", 402),
        make_bottom_slab("Emerald Slab Bottom", 403),
        make_top_slab("Ruby Slab Top", 404),
        make_bottom_slab("Ruby Slab Bottom", 405),
        make_top_slab("Turquoise Slab Top", 406),
        make_bottom_slab("Turquoise Slab Bottom", 407),
        make_top_slab("Amethyst Slab Top", 408),
        make_bottom_slab("Amethyst Slab Bottom", 409),
        make_top_slab("Jade Slab Top", 410),
        make_bottom_slab("Jade Slab Bottom", 411),
        make_top_slab("Coral Slab Top", 412),
        make_bottom_slab("Coral Slab Bottom", 413),
        make_top_slab("Lapis Lazuli Slab Top", 414),
        make_bottom_slab("Lapis Lazuli Slab Bottom", 415),
        make_top_slab("Malachite Slab Top", 416),
        make_bottom_slab("Malachite Slab Bottom", 417),
        make_top_slab("Pyrite Slab Top", 418),
        make_bottom_slab("Pyrite Slab Bottom", 419),
        make_top_slab("Flint Slab Top", 420),
        make_bottom_slab("Flint Slab Bottom", 421),
        make_top_slab("Moonstone Slab Top", 422),
        make_bottom_slab("Moonstone Slab Bottom", 423),
        make_top_slab("Aquamarine Slab Top", 424),
        make_bottom_slab("Aquamarine Slab Bottom", 425),
        make_top_slab("Sunstone Slab Top", 426),
        make_bottom_slab("Sunstone Slab Bottom", 427),
        make_top_slab("Opal Slab Top", 428),
        make_bottom_slab("Opal Slab Bottom", 429),
        make_top_slab("Bloodstone Slab Top", 430),
        make_bottom_slab("Bloodstone Slab Bottom", 431),
        make_top_slab("Rose Quartz Slab Top", 432),
        make_bottom_slab("Rose Quartz Slab Bottom", 433),
        make_top_slab("Iolite Slab Top", 434),
        make_bottom_slab("Iolite Slab Bottom", 435),
        make_top_slab("Hematite Slab Top", 436),
        make_bottom_slab("Hematite Slab Bottom", 437),
        make_top_slab("Azurite Slab Top", 438),
        make_bottom_slab("Azurite Slab Bottom", 439),
    ]);

    registry
}
