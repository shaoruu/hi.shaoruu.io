use voxelize::{Chunk, ChunkStage, Resources, Space, Trees, Vec3, VoxelAccess};

pub struct TreeStage {
    // trees + tree type
    all_trees: Vec<(Trees, String)>,
}

impl TreeStage {
    pub fn new() -> Self {
        Self { all_trees: vec![] }
    }

    pub fn with(mut self, trees: Trees, tree_type: &str) -> Self {
        self.all_trees.push((trees, tree_type.to_string()));
        self
    }
}

impl ChunkStage for TreeStage {
    fn name(&self) -> String {
        "Trees".to_owned()
    }

    fn process(&self, mut chunk: Chunk, resources: Resources, _: Option<Space>) -> Chunk {
        let dirt = resources.registry.get_block_by_name("Dirt");
        let grass_block = resources.registry.get_block_by_name("Grass Block");

        for vx in chunk.min.0..chunk.max.0 {
            for vz in chunk.min.2..chunk.max.2 {
                let height = chunk.get_max_height(vx, vz) as i32;
                let id = chunk.get_voxel(vx, height, vz);

                if id != dirt.id && id != grass_block.id {
                    continue;
                }

                for (trees, tree_type) in self.all_trees.iter() {
                    if trees.should_plant(&Vec3(vx, height, vz)) {
                        trees
                            .generate(&tree_type, &Vec3(vx, height, vz))
                            .into_iter()
                            .for_each(|(Vec3(ux, uy, uz), id)| {
                                chunk.set_voxel(ux, uy, uz, id);
                            });
                    }
                }
            }
        }

        chunk
    }
}
