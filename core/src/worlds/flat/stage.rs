use voxelize::{Chunk, ChunkStage, Resources, Space, Vec3, VoxelAccess};

#[derive(Default)]
pub struct GridLandStage {
    top_height: u32,
    soiling: Vec<u32>,
    grid_size: u32,
    grid_block_id: u32,
}

impl GridLandStage {
    pub fn new() -> Self {
        Self {
            top_height: 0,
            soiling: vec![],
            grid_size: 5,
            grid_block_id: 2,
        }
    }

    pub fn add_soiling(mut self, block: u32, height: usize) -> Self {
        for _ in 0..height {
            self.soiling.push(block);
        }

        self.top_height += height as u32;

        self
    }

    pub fn set_grid(mut self, size: u32, block_id: u32) -> Self {
        self.grid_size = size;
        self.grid_block_id = block_id;

        self
    }

    pub fn query_soiling(&self, y: u32) -> Option<u32> {
        self.soiling.get(y as usize).copied()
    }
}

impl ChunkStage for GridLandStage {
    fn name(&self) -> String {
        "GridLand".to_owned()
    }

    fn process(&self, mut chunk: Chunk, _: Resources, _: Option<Space>) -> Chunk {
        let grid_size = self.grid_size as i32;
        let Vec3(min_x, _, min_z) = chunk.min;
        let Vec3(max_x, _, max_z) = chunk.max;

        for vx in min_x..max_x {
            for vz in min_z..max_z {
                let is_on_grid_outlines = vx % grid_size == 0 || vz % grid_size == 0;

                for vy in 0..self.top_height {
                    if is_on_grid_outlines {
                        chunk.set_voxel(vx, vy as i32, vz, self.grid_block_id);
                    } else if let Some(soiling) = self.query_soiling(vy) {
                        chunk.set_voxel(vx, vy as i32, vz, soiling);
                    }
                }
            }
        }

        chunk
    }
}
