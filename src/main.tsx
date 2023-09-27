import ReactDOM from 'react-dom/client';

import { App } from '@/src/containers/App.tsx';

import '@/src/styles/index.scss';
import '@voxelize/core/dist/styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
