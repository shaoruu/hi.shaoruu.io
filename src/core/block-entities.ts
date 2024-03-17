import type { World } from '@voxelize/core';
import { Group } from 'three';

export class BlockEntities extends Group {
  private unbinds: (() => void)[] = [];

  constructor(private world: World) {
    super();

    this.registerListenersToWorld(world);
    world.add(this);
  }

  handleRightClickAt = (vx: number, vy: number, vz: number) => {
    const data = this.world.getBlockEntityDataAt(vx, vy, vz);
    const block = this.world.getBlockAt(vx, vy, vz);
    console.log(data, block);
    this.world.setBlockEntityDataAt(vx, vy, vz, {
      bozo: 'stringy',
    });
  };

  handleBlockEntityUpdate = (args) => {
    console.log(args);
  };

  registerListenersToWorld = (world: World) => {
    this.unbinds.push(
      world.addBlockEntityUpdateListener(this.handleBlockEntityUpdate),
    );
  };
}
