use nanoid::nanoid;
use specs::Builder;
use voxelize::{PositionComp, World};

use super::components::TextComp;

pub fn setup_entities(world: &mut World) {
    world.set_entity_loader("floating-text", |world, metadata| {
        world
            .create_entity(&nanoid!(), "floating-text")
            .with(metadata.get::<PositionComp>("position").unwrap_or_default())
            .with(metadata.get::<TextComp>("text").unwrap_or_default())
    })
}
