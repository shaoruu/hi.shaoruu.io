import { createContext } from 'react';

import type {
  Character,
  Chat,
  Debug,
  Entities,
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

import type { PeersData } from '../containers/Providers/Voxelize';
import type { Triggers } from '../core/trigger';

export type VoxelizeContextData = {
  worldName: string;
  isConnecting: boolean;

  network?: Network;
  world?: World;
  entities?: Entities;
  rigidControls?: RigidControls;
  inputs?: Inputs<'menu' | 'in-game' | 'chat'>;
  peers?: Peers<Character, PeersData>;
  method?: Method;
  chat?: Chat;
  itemSlots?: ItemSlots;

  voxelInteract?: VoxelInteract;
  shadows?: Shadows;
  lightShined?: LightShined;
  perspective?: Perspective;
  debug?: Debug;
  gui?: GUI;
  triggers?: Triggers;

  camera?: PerspectiveCamera;

  updateHooks: (() => void)[];
};

export const VoxelizeContext = createContext<VoxelizeContextData>({} as any);
