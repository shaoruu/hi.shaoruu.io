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
import type { GUI } from 'dat.gui';
import type { PerspectiveCamera } from 'three';

import type { PeersData } from '../containers/Providers/Voxelize';
import type { BlockEntities } from '../core/block-entities';
import type { Triggers } from '../core/trigger';
import type { ChatItem } from '../types';

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
  blockEntities?: BlockEntities;

  camera?: PerspectiveCamera;

  chatItems: ChatItem[];
  setChatItems: (
    items: ChatItem[] | ((items: ChatItem[]) => ChatItem[]),
  ) => void;

  updateHooks: (() => void)[];
};

export const VoxelizeContext = createContext<VoxelizeContextData>({} as any);
