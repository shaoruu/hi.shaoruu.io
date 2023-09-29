use nanoid::nanoid;
use specs::{Builder, Component, VecStorage, WorldExt};
use voxelize::{PositionComp, World};

#[derive(Default, Component)]
#[storage(VecStorage)]
pub struct Text(pub String);

pub fn setup_entities(world: &mut World) {
    world.ecs_mut().register::<Text>();
}
