import { Agility } from '../components/Agility';
import { AIVoxelizer } from '../components/AIVoxelizer';
import { Crosshair } from '../components/Crosshair';
import { Editing } from '../components/Editing';
import { Inventory } from '../components/Inventory';
import { IV } from '../components/IV';
import { Tooltip } from '../components/Tooltip';
import { currentWorldName } from '../constants';

import { Chat } from '@/src/containers/Chat';
import { LinkBlocks } from '@/src/containers/LinkBlocks';
import { AudioProvider } from '@/src/containers/Providers/Audio';
import { VoxelizeProvider } from '@/src/containers/Providers/Voxelize';

export function App() {
  return (
    <VoxelizeProvider worldName={currentWorldName} canvasId="main">
      <AudioProvider>
        <canvas id="main" />
        <Crosshair />
        <Chat />
        <IV />
        <Tooltip />
        <Inventory />
        <AIVoxelizer />
        <Agility />
        <Editing />
        <LinkBlocks />
        {/* <Menu /> */}
      </AudioProvider>
    </VoxelizeProvider>
  );
}
