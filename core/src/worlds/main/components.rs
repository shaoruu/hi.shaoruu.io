use serde::{Deserialize, Serialize};
use specs::{Component, VecStorage, WorldExt};
use voxelize::World;

#[derive(Default, Component, Serialize, Deserialize)]
#[storage(VecStorage)]
pub struct TextComp(pub String);

impl TextComp {
    pub fn new(text: &str) -> Self {
        Self(text.to_owned())
    }
}

pub fn setup_components(world: &mut World) {
    world.ecs_mut().register::<TextComp>();
}
