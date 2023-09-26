import { ColorText as VoxelizeColorText } from '@voxelize/core';

export const ColorText = ({
  children,
  callback,
  ...rest
}: {
  children?: string;
  callback?: () => void;
}) => {
  return (
    <>
      {VoxelizeColorText.split(children || '').map(({ color, text }) =>
        !color.includes('http') ? (
          <span key={text + color} style={{ color }} {...rest}>
            {text}
          </span>
        ) : (
          <a
            href={color}
            onClick={() => {
              callback?.();
            }}
            key={text + color}
          >
            <span
              style={{ color: 'blue', textDecoration: 'underline' }}
              {...rest}
            >
              {text}
            </span>
          </a>
        ),
      )}
    </>
  );
};
