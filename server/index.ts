import path from 'path';

import chokidar from 'chokidar';

const worldDataWatcher = chokidar.watch(
  path.resolve(__dirname, '..', 'core', 'data'),
);

// worldDataWatcher.on('change', (path) => {
//   console.log(path);
// });
