use specs::DispatcherBuilder;
use voxelize::{
    BroadcastSystem, ChunkGeneratingSystem, ChunkRequestsSystem, ChunkSavingSystem,
    ChunkSendingSystem, ChunkUpdatingSystem, CleanupSystem, CurrentChunkSystem, DataSavingSystem,
    EntitiesMetaSystem, EntitiesSendingSystem, EventsSystem, PeersMetaSystem, PeersSendingSystem,
    PhysicsSystem, UpdateStatsSystem, World,
};

use super::systems::TextMetadataSystem;

pub fn setup_dispatcher(world: &mut World) {
    world.set_dispatcher(|| {
        DispatcherBuilder::new()
            .with(UpdateStatsSystem, "update-stats", &[])
            .with(EntitiesMetaSystem, "entities-meta", &[])
            .with(TextMetadataSystem, "text-metadata", &["entities-meta"])
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
