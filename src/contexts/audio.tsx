import { createContext } from 'react';

import type * as THREE from 'three';

export type PlayAudioOptions = {
  shouldRepeat: boolean;
  // the delay between each repeat in milliseconds
  repeatDelay: number;
  position: THREE.Vector3;
};

export const AudioContext = createContext<{
  playAudio: (
    file: string,
    volume: number,
    options?: Partial<PlayAudioOptions>,
  ) => Promise<(() => void) | undefined>;
}>({
  playAudio: (
    file: string,
    volume: number,
    options?: Partial<PlayAudioOptions>,
  ) => new Promise(() => {}),
});
