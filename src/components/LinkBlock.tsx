import { useEffect } from 'react';

import { useVoxelize } from '../hooks/useVoxelize';

type Props = {
  url: string;
  blockName: string;
  action?: () => void;
};

export function LinkBlock({ url, blockName }: Props) {
  const { inputs, voxelInteract, rigidControls } = useVoxelize();

  useEffect(() => {
    if (!inputs || !voxelInteract || !rigidControls) {
      return;
    }

    const unbind = inputs?.click('right', () => {
      if (!voxelInteract.target) {
        return;
      }

      const [vx, vy, vz] = voxelInteract.target;
      const block = voxelInteract.world.getBlockAt(vx, vy, vz);

      if (block.name === blockName) {
        window.open(url, '_blank');
        rigidControls.resetMovements();
      }
    });

    return () => {
      unbind();
    };
  }, [inputs, voxelInteract, url, blockName, rigidControls]);

  return <></>;
}
