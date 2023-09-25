import { useContext } from 'react';

import { VoxelizeContext } from '../contexts/voxelize';

export function useVoxelize() {
  return useContext(VoxelizeContext);
}
