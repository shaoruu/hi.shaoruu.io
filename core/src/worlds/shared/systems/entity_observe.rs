use specs::{Entity, ReadExpect, ReadStorage, System, WriteStorage};
use voxelize::{trace, Chunks, RigidBodyComp, Vec3, VoxelAccess, WorldConfig};

use crate::worlds::shared::{components::TargetComp, kdtree::KdTree};

pub struct EntityObserveSystem;

impl<'a> System<'a> for EntityObserveSystem {
    #[allow(clippy::type_complexity)]
    type SystemData = (
        ReadExpect<'a, KdTree>,
        ReadExpect<'a, Chunks>,
        ReadStorage<'a, RigidBodyComp>,
        WriteStorage<'a, TargetComp>,
    );

    fn run(&mut self, data: Self::SystemData) {
        use rayon::prelude::*;
        use specs::ParJoin;

        let (tree, chunks, bodies, mut targets) = data;

        let test_solid = |x: i32, y: i32, z: i32| -> bool { !chunks.get_voxel(x, y, z) != 0 };

        (&bodies, &mut targets)
            .par_join()
            .for_each(|(body, target)| {
                let position = body.0.get_position();
                let closest_arr = tree.search(&position, 1);

                if closest_arr.len() > 0 {
                    let entity = closest_arr[0].1;
                    let body = bodies.get(entity.to_owned()).unwrap();
                    let position = body.0.get_position();

                    target.0 = Some(position);
                } else {
                    target.0 = None;
                }
            });
    }
}
