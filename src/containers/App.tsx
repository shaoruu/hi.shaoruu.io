import { VoxelizeProvider } from '../contexts/Voxelize';

export function App() {
  return (
    <VoxelizeProvider worldName="main" canvasId="main">
      <canvas id="main" />
    </VoxelizeProvider>
  );
}
