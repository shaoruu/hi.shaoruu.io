mod entity_observe;
mod entity_tree;
mod path_finding;
mod path_metadata;
mod rotation_metadata;
mod target_metadata;
mod text_metadata;

use specs::DispatcherBuilder;
use voxelize::{
    BroadcastSystem, ChunkGeneratingSystem, ChunkRequestsSystem, ChunkSavingSystem,
    ChunkSendingSystem, ChunkUpdatingSystem, CleanupSystem, CurrentChunkSystem, DataSavingSystem,
    EntitiesMetaSystem, EntitiesSendingSystem, EventsSystem, PeersMetaSystem, PeersSendingSystem,
    PhysicsSystem, UpdateStatsSystem, World,
};

use self::{
    entity_observe::EntityObserveSystem, entity_tree::EntityTreeSystem,
    path_finding::PathFindingSystem, path_metadata::PathMetadataSystem,
    rotation_metadata::RotationMetadataSystem, target_metadata::TargetMetadataSystem,
    text_metadata::TextMetadataSystem,
};

pub fn setup_dispatcher(world: &mut World) {
    world.set_dispatcher(|| {
        DispatcherBuilder::new()
            .with(UpdateStatsSystem, "update-stats", &[])
            .with(EntityObserveSystem, "entity-observe", &[])
            .with(PathFindingSystem, "path-finding", &["entity-observe"])
            .with(TextMetadataSystem, "text-meta", &[])
            .with(TargetMetadataSystem, "target-meta", &[])
            .with(RotationMetadataSystem, "rotation-meta", &[])
            .with(PathMetadataSystem, "path-meta", &[])
            .with(EntityTreeSystem, "entity-tree", &[])
            .with(
                EntitiesMetaSystem,
                "entities-meta",
                &[
                    "text-meta",
                    "target-meta",
                    "rotation-meta",
                    "path-meta",
                    "entity-observe",
                    "entity-tree",
                ],
            )
            .with(PeersMetaSystem, "peers-meta", &[])
            .with(CurrentChunkSystem, "current-chunk", &[])
            .with(ChunkUpdatingSystem, "chunk-updating", &["current-chunk"])
            .with(ChunkRequestsSystem, "chunk-requests", &["current-chunk"])
            .with(
                ChunkGeneratingSystem,
                "chunk-generation",
                &["chunk-requests"],
            )
            .with(ChunkSendingSystem, "chunk-sending", &["chunk-generation"])
            .with(ChunkSavingSystem, "chunk-saving", &["chunk-generation"])
            .with(PhysicsSystem, "physics", &["current-chunk", "update-stats"])
            .with(DataSavingSystem, "entities-saving", &["entities-meta"])
            .with(
                EntitiesSendingSystem,
                "entities-sending",
                &["entities-meta"],
            )
            .with(PeersSendingSystem, "peers-sending", &["peers-meta"])
            .with(
                BroadcastSystem,
                "broadcast",
                &["chunk-sending", "entities-sending", "peers-sending"],
            )
            .with(
                CleanupSystem,
                "cleanup",
                &["entities-sending", "peers-sending"],
            )
            .with(EventsSystem, "events", &["broadcast"])
    });
}
