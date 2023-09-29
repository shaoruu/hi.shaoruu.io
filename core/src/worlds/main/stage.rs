use voxelize::{Chunk, ChunkStage, Resources, Space, Vec3, VoxelAccess};

const ISLAND_LIMIT: i32 = 1;
const ISLAND_HEIGHT: i32 = 10;

pub struct LimitedStage;

impl ChunkStage for LimitedStage {
    fn name(&self) -> String {
        "Limited Stage".to_owned()
    }

    fn process(&self, mut chunk: Chunk, resources: Resources, _: Option<Space>) -> Chunk {
        if chunk.coords.0 > ISLAND_LIMIT
            || chunk.coords.1 > ISLAND_LIMIT
            || chunk.coords.0 < -ISLAND_LIMIT
            || chunk.coords.1 < -ISLAND_LIMIT
        {
            return chunk;
        }

        let id = resources.registry.get_block_by_name("Stone").id;

        let Vec3(min_x, _, min_z) = chunk.min;
        let Vec3(max_x, _, max_z) = chunk.max;

        for vx in min_x..max_x {
            for vz in min_z..max_z {
                for vy in 0..ISLAND_HEIGHT {
                    chunk.set_voxel(vx, vy, vz, id);
                }
            }
        }

        chunk
    }
}
