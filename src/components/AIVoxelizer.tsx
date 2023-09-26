import { useEffect, useState } from 'react';

import axios from 'axios';
import classNames from 'classnames';

import { useVoxelize } from '../hooks/useVoxelize';

export function AIVoxelizer() {
  const { world, gui } = useVoxelize();

  const [prompt, setPrompt] = useState('');
  const [width, setWidth] = useState(64);

  const [shouldShowMenu, setShouldShowMenu] = useState(false);

  useEffect(() => {
    if (!world || !gui) {
      return;
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShouldShowMenu(false);
      }
    };

    const functions = {
      'Toggle Menu': () => {
        setShouldShowMenu((prev) => !prev);
      },
    };

    gui.add(functions, 'Toggle Menu');

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [world, gui]);

  const buttonClassName =
    'bg-background-primary-light rounded p-2 border-border border-solid border hoverable-overlay relative cursor-pointer';

  return (
    <>
      {shouldShowMenu && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setShouldShowMenu(false)}
          />
          <div className="w-[500px] flex flex-col items-center bg-text-primary rounded z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fixed gap-1.5 px-5 py-4 text-background-primary">
            <h1 className="text-2xl font-bold">DALL·E 2 Voxelizer</h1>
            <div className="flex flex-col gap-1 w-full">
              <p className="text-xs">Prompt:</p>
              <textarea
                autoFocus
                className="h-[100px] bg-gray-text rounded p-2 outline-none text-background-primary resize-none border-slate-400 border-solid border"
                placeholder="Enter text here"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <p className="text-xs">Width</p>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value))}
                className="bg-gray-text rounded p-2 outline-none text-background-primary resize-none border-slate-400 border-solid border"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <button
                className={classNames(buttonClassName)}
                onClick={async () => {
                  if (!world) {
                    return;
                  }

                  const response = await axios(
                    'http://localhost:8080/voxelize',
                    {
                      params: {
                        prompt,
                      },
                    },
                  );

                  const { data } = response;

                  console.log(data);
                }}
              >
                Voxelize
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
