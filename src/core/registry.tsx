import type { World } from '@voxelize/core';

import StoneBlock from '../assets/images/blocks/stone.png';

export async function makeRegistry(world: World) {
  const all = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];

  await world.applyBlockTextures([
    { idOrName: 'Stone', faceNames: all, source: StoneBlock },
  ]);
}
