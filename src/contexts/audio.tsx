import { createContext } from 'react';

import type * as THREE from 'three';

export const AudioContext = createContext<{
  playAudio: (
    file: string,
    volume: number,
    position?: THREE.Vector3,
  ) => Promise<void>;
}>({
  playAudio: (file: string, volume: number, position?: THREE.Vector3) =>
    new Promise(() => {}),
});
