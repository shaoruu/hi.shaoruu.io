import { useEffect } from 'react';

import { SpriteText, type Coords3 } from '@voxelize/core';
import axios from 'axios';
import { Group } from 'three';

import { useVoxelize } from '../hooks/useVoxelize';
import { getServerUrl } from '../utils/urls';

const location = [4, 36, 4] as Coords3;

export function TopStars() {
  const { world } = useVoxelize();

  useEffect(() => {
    if (!world) return;

    const group = new Group();
    group.position.set(...location);

    const fetch = async () => {
      const response = await axios(`${getServerUrl()}/top-stars`);
      const { result } = response.data;

      result.forEach((result: any, index) => {
        const itemText = new SpriteText(
          `${index + 1}. ${result.name} - ${result.stars}`,
          0.5,
        );

        itemText.position.set(0, result.length - index, 0);

        group.add(itemText);
      });

      world.add(group);
    };

    fetch();

    return () => {
      world.remove(group);
    };
  }, [world]);

  return <></>;
}
