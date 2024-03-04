import { useEffect } from 'react';

import { Vector3 } from 'three';

import { ImageVoxelizer } from '../core/image-voxelizer';
import { useVoxelize } from '../hooks/useVoxelize';
import { isAdmin } from '../utils/isAdmin';

export const IV = () => {
  const { chat, world, rigidControls } = useVoxelize();

  useEffect(() => {
    if (!chat || !world || !rigidControls) return;
    if (!isAdmin()) return;

    chat.addCommand('iv', (rest) => {
      const { url, options = {} } = ImageVoxelizer.parse(rest);

      ImageVoxelizer.build(
        url,
        world,
        new Vector3(...rigidControls.voxel),
        options,
      );
    });
  }, [chat, world, rigidControls]);

  return <></>;
};
