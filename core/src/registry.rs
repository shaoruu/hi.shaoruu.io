use voxelize::{Block, BlockFaces, Registry, SIX_FACES_NX};

pub fn get_registry() -> Registry {
    let mut registry = Registry::new();

    registry.register_blocks(&[
        Block::new("Dirt").id(1).build(),
        Block::new("Stone").id(2).build(),
        Block::new("Sand")
            .id(3)
            .faces(&BlockFaces::six_faces().build().independent_at(SIX_FACES_NX))
            .build(),
    ]);

    registry
}
