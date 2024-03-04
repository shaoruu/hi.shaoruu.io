import { useEffect, useState } from 'react';

import axios from 'axios';
import classNames from 'classnames';
import ReactLoading from 'react-loading';
import { Vector3 } from 'three';

import { ImageVoxelizer } from '../core/image-voxelizer';
import { useVoxelize } from '../hooks/useVoxelize';
import { isAdmin } from '../utils/isAdmin';
import { getServerUrl } from '../utils/urls';

export function AIVoxelizer() {
  const { world, gui, rigidControls } = useVoxelize();

  const [prompt, setPrompt] = useState('');
  const [width, setWidth] = useState(64);
  const [orientation, setOrientation] = useState<'x' | 'z'>('x');

  const [isLoading, setIsLoading] = useState(false);

  const [shouldShowMenu, setShouldShowMenu] = useState(false);

  useEffect(() => {
    if (!world || !gui) {
      return;
    }

    if (!isAdmin()) {
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
    'bg-background-primary-light rounded p-2 border-border border-solid border hoverable-overlay relative cursor-pointer flex items-center justify-center gap-1 align-middle text-sm';

  return (
    <>
      {shouldShowMenu && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setShouldShowMenu(false)}
          />
          <div className="w-[500px] flex flex-col items-center bg-text-primary rounded z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 fixed gap-1.5 px-5 py-4 text-background-primary">
            <h1 className="text-2xl font-bold">DALL·E 3 Voxelizer</h1>
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
            <div className="flex gap-1 w-full">
              <div className="flex flex-col gap-1 flex-1">
                <p className="text-xs">Width</p>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value))}
                  className="bg-gray-text rounded p-2 outline-none text-background-primary resize-none border-slate-400 border-solid border"
                />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <p className="text-xs">Orientation</p>
                <button
                  className={classNames(
                    buttonClassName,
                    orientation === 'x' && 'bg-background-primary',
                  )}
                  onClick={() =>
                    setOrientation(orientation === 'x' ? 'z' : 'x')
                  }
                >
                  {orientation}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <button
                className={classNames(
                  buttonClassName,
                  (!prompt || isLoading) && 'half-disabled',
                )}
                onClick={async () => {
                  if (!world || !rigidControls) {
                    return;
                  }

                  setIsLoading(true);

                  const response = await axios(`${getServerUrl()}/voxelize`, {
                    method: 'GET',
                    params: {
                      prompt,
                      secretKey: process.env.SECRET_ADMIN_KEY,
                    },
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  });

                  const { data } = response;
                  const { result } = data;
                  const [{ b64_json }] = result;

                  ImageVoxelizer.build(
                    b64_json,
                    world,
                    new Vector3(...rigidControls.voxel),
                    {
                      width,
                      height: width,
                      lockedRatio: true,
                      orientation,
                    },
                  );

                  setIsLoading(false);
                  setShouldShowMenu(false);
                }}
              >
                {isLoading && (
                  <ReactLoading
                    color="var(--color-gray-text)"
                    type="spin"
                    height={12}
                    width={12}
                  />
                )}
                <p>Voxelize</p>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
