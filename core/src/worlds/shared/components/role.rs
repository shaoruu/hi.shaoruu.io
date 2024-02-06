use serde::Serialize;
use specs::{Component, VecStorage};

#[derive(Default, Component, Serialize)]
#[storage(VecStorage)]
pub struct RoleComp(pub String);
