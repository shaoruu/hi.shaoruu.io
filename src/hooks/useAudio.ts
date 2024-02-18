import { useContext } from 'react';

import { AudioContext } from '../contexts/audio';

export const useAudio = () => useContext(AudioContext);
