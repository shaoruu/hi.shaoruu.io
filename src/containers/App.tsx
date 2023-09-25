import { Crosshair } from '../components/Crosshair';

import { Chat } from '@/src/containers/Chat';
import { VoxelizeProvider } from '@/src/containers/Providers/Voxelize';

export function App() {
  return (
    <VoxelizeProvider worldName="main" canvasId="main">
      <canvas id="main" />
      <Crosshair />
      <Chat />
    </VoxelizeProvider>
  );
}
