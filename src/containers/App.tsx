import { AIVoxelizer } from '../components/AIVoxelizer';
import { Crosshair } from '../components/Crosshair';
import { IV } from '../components/IV';

import { Chat } from '@/src/containers/Chat';
import { VoxelizeProvider } from '@/src/containers/Providers/Voxelize';

export function App() {
  return (
    <VoxelizeProvider worldName="main" canvasId="main">
      <canvas id="main" />
      <Crosshair />
      <Chat />
      <IV />
      <AIVoxelizer />
    </VoxelizeProvider>
  );
}
