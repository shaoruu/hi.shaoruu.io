import { createContext } from 'react';

import type {
  Character,
  Chat,
  Debug,
  Inputs,
  ItemSlots,
  LightShined,
  Method,
  Network,
  Peers,
  Perspective,
  RigidControls,
  Shadows,
  VoxelInteract,
  World,
} from '@voxelize/core';
import type { GUI } from 'lil-gui';
import type { PerspectiveCamera } from 'three';

export type VoxelizeContextData = {
  worldName: string;
  isConnecting: boolean;

  network?: Network;
  world?: World;
  rigidControls?: RigidControls;
  inputs?: Inputs<'menu' | 'in-game' | 'chat'>;
  peers?: Peers<Character>;
  method?: Method;
  chat?: Chat;
  itemSlots?: ItemSlots;

  voxelInteract?: VoxelInteract;
  shadows?: Shadows;
  lightShined?: LightShined;
  perspective?: Perspective;
  debug?: Debug;
  gui?: GUI;

  camera?: PerspectiveCamera;

  updateHooks: (() => void)[];
};

export const VoxelizeContext = createContext<VoxelizeContextData>({} as any);
