import { useEffect } from 'react';

import AmbientNoise from '../assets/sounds/game/forest.ogg';
import { useAudio } from '../hooks/useAudio';

const AMBIENT_NOISE_VOLUME = 0.1;
const AMBIENT_NOISE_REPEAT_DELAY = 1000;

export function Ambient() {
  const { playAudio } = useAudio();

  useEffect(() => {
    let stopAudio: (() => void) | undefined;

    const playAudioAsync = async () => {
      stopAudio = await playAudio(AmbientNoise, AMBIENT_NOISE_VOLUME, {
        repeatDelay: AMBIENT_NOISE_REPEAT_DELAY,
      });
    };
    playAudioAsync();

    return () => {
      stopAudio?.();
    };
  }, [playAudio]);

  return null;
}
