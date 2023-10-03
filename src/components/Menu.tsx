import { useEffect, useState } from 'react';

import { useVoxelize } from '../hooks/useVoxelize';

export function Menu() {
  const { inputs, rigidControls } = useVoxelize();

  const [shouldShowMenu, setShouldShowMenu] = useState(true);

  useEffect(() => {
    if (!inputs || !rigidControls) {
      return;
    }

    inputs.on('namespace', (namespace) => {
      if (namespace === 'menu') {
        setShouldShowMenu(true);
      }
    });

    rigidControls.on('lock', () => {
      setShouldShowMenu(false);
    });
  }, [inputs, rigidControls]);

  return shouldShowMenu ? (
    <div className="fixed inset-0 bg-overlay flex items-center justify-center">
      <div className="bg-text-primary text-background-primary px-4 py-3.5 rounded border border-solid border-border min-w-[300px] flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <p className="text-gray-background-dark">v0.0.0</p>
          <h1>SHAORUU.IO</h1>
        </div>
        <button
          className="border-none bg-background-tertiary text-text-primary py-2 rounded text-base hover:bg-background-secondary flex items-center justify-center align-middle cursor-pointer"
          onClick={() => {
            rigidControls?.lock();
          }}
        >
          PLAY
        </button>
      </div>
    </div>
  ) : (
    <></>
  );
}
