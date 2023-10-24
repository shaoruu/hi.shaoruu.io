use serde::{Deserialize, Serialize};
use specs::{Component, VecStorage};
use voxelize::Vec3;

#[derive(Component, Debug, Serialize, Deserialize)]
#[storage(VecStorage)]
pub struct PathComp {
    pub path: Option<Vec<Vec3<i32>>>,
    pub current_index: usize,
}
