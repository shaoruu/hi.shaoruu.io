import { customShaders, type World } from '@voxelize/core';
import { CanvasTexture, Color, NearestFilter } from 'three';

import Amethyst from '../assets/images/blocks/amethyst.png';
import Andersite from '../assets/images/blocks/andersite_block.png';
import Aquamarine from '../assets/images/blocks/aquamarine.png';
import Azurite from '../assets/images/blocks/azurite.png';
import Basalt from '../assets/images/blocks/basalt_block.png';
import BirchLogSide from '../assets/images/blocks/birch_log_side.png';
import BirchLogTop from '../assets/images/blocks/birch_log_top.png';
import BlackConcrete from '../assets/images/blocks/black_concrete.png';
import Bloodstone from '../assets/images/blocks/bloodstone.png';
import BlueConcrete from '../assets/images/blocks/blue_concrete.png';
import BlueLaceAgate from '../assets/images/blocks/blue_lace_agate.png';
import BuyMeACoffee from '../assets/images/blocks/buymeacoffee.png';
import Chalk from '../assets/images/blocks/chalk_block.png';
import CondorAgate from '../assets/images/blocks/condor_agate.png';
import Coral from '../assets/images/blocks/coral.png';
import CrazyLaceAgate from '../assets/images/blocks/crazy_lace_agate.png';
import Diorite from '../assets/images/blocks/diorite_block.png';
import Emerald from '../assets/images/blocks/emerald.png';
import EnhydroAgate from '../assets/images/blocks/enhydro_agate.png';
import Flint from '../assets/images/blocks/flint.png';
import Gabbro from '../assets/images/blocks/gabbro_block.png';
import Github from '../assets/images/blocks/github.png';
import Glass from '../assets/images/blocks/glass.png';
import Granite from '../assets/images/blocks/granite_block.png';
import Graphite from '../assets/images/blocks/graphite_block.png';
import Hematite from '../assets/images/blocks/hematite.png';
import Iolite from '../assets/images/blocks/iolite.png';
import Ivory from '../assets/images/blocks/ivory_block.png';
import Jade from '../assets/images/blocks/jade.png';
import LapisLazuli from '../assets/images/blocks/lapis_lazuli.png';
import Limestone from '../assets/images/blocks/limestone_block.png';
import LinkedIn from '../assets/images/blocks/linkedin.png';
import Mail from '../assets/images/blocks/mail.png';
import Malachite from '../assets/images/blocks/malachite.png';
import Marble from '../assets/images/blocks/marble_block.png';
import Moonstone from '../assets/images/blocks/moonstone.png';
import MossAgate from '../assets/images/blocks/moss_agate.png';
import OakPlanks from '../assets/images/blocks/oak_planks.png';
import Obsidian from '../assets/images/blocks/obsidian_block.png';
import OnyxAgate from '../assets/images/blocks/onyx_agate.png';
import Opal from '../assets/images/blocks/opal.png';
import OrangeConcrete from '../assets/images/blocks/orange_concrete.png';
import Pumice from '../assets/images/blocks/pumice_block.png';
import Pyrite from '../assets/images/blocks/pyrite.png';
import Quartzite from '../assets/images/blocks/quartzite_block.png';
import RedConcrete from '../assets/images/blocks/red_concrete.png';
import RoseQuartz from '../assets/images/blocks/rose_quartz.png';
import Ruby from '../assets/images/blocks/ruby.png';
import SageniteAgate from '../assets/images/blocks/sagenite_agate.png';
import Sand from '../assets/images/blocks/sand_block.png';
import Sapphire from '../assets/images/blocks/sapphire.png';
import Scoria from '../assets/images/blocks/scoria_block.png';
import Sunstone from '../assets/images/blocks/sunstone.png';
import Tuff from '../assets/images/blocks/tuff_block.png';
import Turquoise from '../assets/images/blocks/turquoise.png';
import Twitter from '../assets/images/blocks/twitter.png';
import WhiteConcrete from '../assets/images/blocks/white_concrete.png';
import YellowConcrete from '../assets/images/blocks/yellow_concrete.png';
import Youtube from '../assets/images/blocks/youtube.png';
import GraphQL from '../assets/images/ui/graphql.png';
import MCJSLegacy from '../assets/images/ui/mc.js-legacy.png';
import MCJS from '../assets/images/ui/mcjs.png';
import MineJS from '../assets/images/ui/minejs.png';
import RSTS from '../assets/images/ui/rust-ts.png';
import Voxelize from '../assets/images/ui/voxelize.png';
import Water from '../assets/voxelize/own/water.png';
import Dirt from '../assets/voxelize/pixel-perfection/dirt.png';
import Grass from '../assets/voxelize/pixel-perfection/grass.png';
import GrassBlockSide from '../assets/voxelize/pixel-perfection/grass_side.png';
import GrassBlockTop from '../assets/voxelize/pixel-perfection/grass_top.png';
import OakLeaves from '../assets/voxelize/pixel-perfection/leaves_oak.png';
import OakLogSide from '../assets/voxelize/pixel-perfection/log_oak_side.png';
import OakLogTop from '../assets/voxelize/pixel-perfection/log_oak_top.png';
import Stone from '../assets/voxelize/pixel-perfection/stone.png';

export async function makeRegistry(world: World) {
  const all = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];

  const commonBlocks = [
    { idOrName: 'Dirt', faceNames: all, source: Dirt },
    { idOrName: 'Stone', faceNames: all, source: Stone },
    { idOrName: 'Sand', faceNames: all, source: Sand },
    { idOrName: 'Chalk', faceNames: all, source: Chalk },
    { idOrName: 'Pumice', faceNames: all, source: Pumice },
    { idOrName: 'Scoria', faceNames: all, source: Scoria },
    { idOrName: 'Tuff', faceNames: all, source: Tuff },
    { idOrName: 'Limestone', faceNames: all, source: Limestone },
    { idOrName: 'Marble', faceNames: all, source: Marble },
    { idOrName: 'Granite', faceNames: all, source: Granite },
    { idOrName: 'Diorite', faceNames: all, source: Diorite },
    { idOrName: 'Gabbro', faceNames: all, source: Gabbro },
    { idOrName: 'Basalt', faceNames: all, source: Basalt },
    { idOrName: 'Obsidian', faceNames: all, source: Obsidian },
    { idOrName: 'Quartzite', faceNames: all, source: Quartzite },
    { idOrName: 'Andersite', faceNames: all, source: Andersite },
    { idOrName: 'Graphite', faceNames: all, source: Graphite },
    { idOrName: 'Blue Lace Agate', faceNames: all, source: BlueLaceAgate },
    { idOrName: 'Condor Agate', faceNames: all, source: CondorAgate },
    { idOrName: 'Crazy Lace Agate', faceNames: all, source: CrazyLaceAgate },
    { idOrName: 'Enhydro Agate', faceNames: all, source: EnhydroAgate },
    { idOrName: 'Moss Agate', faceNames: all, source: MossAgate },
    { idOrName: 'Onyx Agate', faceNames: all, source: OnyxAgate },
    { idOrName: 'Sagenite Agate', faceNames: all, source: SageniteAgate },
    { idOrName: 'Sapphire', faceNames: all, source: Sapphire },
    { idOrName: 'Emerald', faceNames: all, source: Emerald },
    { idOrName: 'Ruby', faceNames: all, source: Ruby },
    { idOrName: 'Turquoise', faceNames: all, source: Turquoise },
    { idOrName: 'Amethyst', faceNames: all, source: Amethyst },
    { idOrName: 'Jade', faceNames: all, source: Jade },
    { idOrName: 'Coral', faceNames: all, source: Coral },
    { idOrName: 'Lapis Lazuli', faceNames: all, source: LapisLazuli },
    { idOrName: 'Malachite', faceNames: all, source: Malachite },
    { idOrName: 'Pyrite', faceNames: all, source: Pyrite },
    { idOrName: 'Flint', faceNames: all, source: Flint },
    { idOrName: 'Moonstone', faceNames: all, source: Moonstone },
    { idOrName: 'Aquamarine', faceNames: all, source: Aquamarine },
    { idOrName: 'Sunstone', faceNames: all, source: Sunstone },
    { idOrName: 'Opal', faceNames: all, source: Opal },
    { idOrName: 'Bloodstone', faceNames: all, source: Bloodstone },
    { idOrName: 'Rose Quartz', faceNames: all, source: RoseQuartz },
    { idOrName: 'Iolite', faceNames: all, source: Iolite },
    { idOrName: 'Hematite', faceNames: all, source: Hematite },
    { idOrName: 'Azurite', faceNames: all, source: Azurite },
  ];

  await world.applyBlockTextures([
    ...commonBlocks,
    ...commonBlocks.map((block) => ({
      ...block,
      idOrName: `${block.idOrName} Slab Top`,
    })),
    ...commonBlocks.map((block) => ({
      ...block,
      idOrName: `${block.idOrName} Slab Bottom`,
    })),
    ...commonBlocks.map((block) => ({
      ...block,
      idOrName: `${block.idOrName} Rod`,
    })),
    ...commonBlocks.map((block) => ({
      ...block,
      idOrName: `${block.idOrName} Thin Rod`,
    })),
  ]);

  for (const face of all) {
    for (const project of [
      'mc.js',
      'modern-graphql-tutorial',
      'mine.js',
      'voxelize',
      'mc.js-legacy',
      'rust-typescript-template',
    ]) {
      const trophyName = `Trophy (${project})`;

      await world.applyBlockTexture(
        trophyName,
        `stand${face}`,
        new Color('#E25E3E'),
      );

      await world.applyBlockTexture(
        trophyName,
        `handleleft${face}`,
        new Color('#F0A500'),
      );

      await world.applyBlockTexture(
        trophyName,
        `handleright${face}`,
        new Color('#F0A500'),
      );

      await world.applyBlockTexture(
        trophyName,
        `column${face}`,
        new Color('#FF9B50'),
      );

      await world.applyBlockTexture(
        trophyName,
        `cup${face}`,
        new Color('#FAC213'),
      );
    }
  }

  await world.applyBlockTexture('Year Percentage', all, Obsidian);

  const createYearProgressCanvas = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }
    const width = 400;
    const height = (width / 0.8) * 0.3;

    canvas.width = width;
    canvas.height = height;

    // Padding adjustments
    const padding = width * 0.05; // 5% padding
    const bottomTextPadding = width * 0.1; // Additional padding for text at the bottom
    const paddedWidth = width - padding * 2;
    const paddedHeight = height - padding - bottomTextPadding; // Adjusted for bottom text

    // Background
    ctx.fillStyle = '#000000'; // Black background
    ctx.fillRect(0, 0, width, height);

    // Calculate year progress
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const end = new Date(now.getFullYear() + 1, 0, 0);
    const yearPassed =
      (now.getTime() - start.getTime()) / (end.getTime() - start.getTime());

    // Progress bar background
    ctx.fillStyle = '#121212'; // Black background for the progress bar
    ctx.fillRect(padding, padding, paddedWidth, paddedHeight);

    // Progress bar
    ctx.fillStyle = '#00FF00'; // Green bar
    ctx.fillRect(padding, padding, paddedWidth * yearPassed, paddedHeight);

    // Data text
    ctx.font = `${width * 0.04}px ConnectionSerif-d20X`;
    ctx.fillStyle = '#FFFFFF'; // White text
    const text = `${Math.round(yearPassed * 100)}% of the year passed`;
    ctx.textAlign = 'center'; // Align text to center horizontally
    ctx.fillText(text, width / 2, height - padding); // Center text

    return canvas;
  };
  const yearProgressCanvas = createYearProgressCanvas();
  const yearProgressTexture = new CanvasTexture(yearProgressCanvas);

  yearProgressTexture.magFilter = NearestFilter;
  yearProgressTexture.minFilter = NearestFilter;

  await world.applyBlockTexture(
    'Year Percentage',
    'pz',
    yearProgressCanvas.toDataURL(),
  );

  await world.applyBlockTexture('Current Time', all, Obsidian);

  const currentTimeWidth = 400;
  const currentTimeHeight = (currentTimeWidth / 0.8) * 0.3;
  // Padding adjustments
  const currentTimePadding = currentTimeWidth * 0.05; // 5% padding
  const currentTimePaddedWidth = currentTimeWidth - currentTimePadding * 2;
  const currentTimePaddedHeight = currentTimeHeight - currentTimePadding * 2; // Adjusted height for time display

  const createCurrentTimeCanvas = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    canvas.width = currentTimeWidth;
    canvas.height = currentTimeHeight;

    // Background
    ctx.fillStyle = '#000000'; // Black background
    ctx.fillRect(0, 0, currentTimeWidth, currentTimeHeight);

    return canvas;
  };

  const currentTimeCanvas = createCurrentTimeCanvas();
  const currentTimeTexture = new CanvasTexture(currentTimeCanvas);

  // Function to update time every second with a more readable format and display the current date
  const updateTime = () => {
    const ctx = currentTimeCanvas.getContext('2d');

    if (!ctx) return;

    const now = new Date();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    // Use a more readable time format: HH:MM:SS AM/PM
    const amPm = now.getHours() >= 12 ? 'PM' : 'AM';
    const formattedHours = now.getHours() % 12 || 12; // Converts 24h to 12h format and treats 0 as 12
    const timeString = `${formattedHours
      .toString()
      .padStart(2, '0')}:${minutes}:${seconds} ${amPm}`;
    const dateString = now.toLocaleDateString(); // Get current date in local format

    // Clear previous time and date display
    ctx.fillStyle = '#000000'; // Black background to clear with
    ctx.fillRect(
      currentTimePadding,
      currentTimePadding,
      currentTimePaddedWidth,
      currentTimePaddedHeight + currentTimeWidth * 0.1, // Adjust bottom padding based on width
    );

    // Display current time in a more readable format
    ctx.font = `${currentTimeWidth * 0.15}px ConnectionSerif-d20X`; // Adjust font size for the new format
    ctx.fillStyle = '#FFFFFF'; // White text for better contrast
    ctx.textAlign = 'center'; // Center text horizontally
    // Adjust position for centering the text with the new format, considering additional date display
    const textYPosition =
      currentTimeHeight / 2 + currentTimePadding - currentTimeWidth * 0.05;
    ctx.fillText(timeString, currentTimeWidth / 2, textYPosition);

    // Display current date below the time
    ctx.font = `${currentTimeWidth * 0.06}px ConnectionSerif-d20X`; // Slightly smaller font for the date
    ctx.fillText(
      `${dateString} (local)`,
      currentTimeWidth / 2,
      textYPosition + currentTimeWidth * 0.1, // Position the date below the time
    );

    currentTimeTexture.needsUpdate = true;
  };

  // Initial time update
  updateTime();

  // Update time every second
  setInterval(updateTime, 1000);

  currentTimeTexture.minFilter = NearestFilter;
  currentTimeTexture.magFilter = NearestFilter;

  await world.applyBlockTexture('Current Time', 'pz', currentTimeTexture);

  console.log(
    world
      .getBlockByName('Year Percentage')
      .faces.find((face) => face.name === 'pz'),
  );

  await world.applyBlockTexture('Trophy (mc.js)', 'cuppz', MCJS);
  await world.applyBlockTexture('Trophy (mine.js)', 'cuppz', MineJS);
  await world.applyBlockTexture(
    'Trophy (modern-graphql-tutorial)',
    'cuppz',
    GraphQL,
  );
  await world.applyBlockTexture('Trophy (voxelize)', 'cuppz', Voxelize);
  await world.applyBlockTexture('Trophy (mc.js-legacy)', 'cuppz', MCJSLegacy);
  await world.applyBlockTexture(
    'Trophy (rust-typescript-template)',
    'cuppz',
    RSTS,
  );

  await world.applyBlockTexture('Youtube', 'displaypz', Youtube);
  await world.applyBlockTexture('LinkedIn', 'displaypz', LinkedIn);
  await world.applyBlockTexture('Github', 'displaypz', Github);
  await world.applyBlockTexture('Twitter', 'displaypz', Twitter);
  await world.applyBlockTexture('Mail', 'displaypz', Mail);
  await world.applyBlockTexture('BuyMeACoffee', 'displaypz', BuyMeACoffee);

  for (const name of [
    'Youtube',
    'LinkedIn',
    'Github',
    'Twitter',
    'Mail',
    'BuyMeACoffee',
  ]) {
    for (const face of all) {
      if (face === 'pz') continue;

      await world.applyBlockTexture(
        name,
        `display${face}`,
        new Color('#121212'),
      );
    }

    for (const face of all) {
      await world.applyBlockTexture(name, `stand${face}`, new Color('#272829'));
    }
  }

  await world.applyBlockTextures([
    {
      idOrName: 'Mushroom',
      faceNames: all.map((name) => `bottom-${name}-`),
      source: new Color('#A27B5C'),
    },
    {
      idOrName: 'Mushroom',
      faceNames: all.map((name) => `top-${name}-`),
      source: new Color('#E4DCCF'),
    },
  ]);

  for (const face of all) {
    await world.applyBlockTexture(
      'Github Contribution L0',
      face,
      new Color('#F5F5DC'),
    );
    await world.applyBlockTexture(
      'Github Contribution L1',
      face,
      new Color('#9be9a8'),
    );
    await world.applyBlockTexture(
      'Github Contribution L2',
      face,
      new Color('#40c463'),
    );
    await world.applyBlockTexture(
      'Github Contribution L3',
      face,
      new Color('#30a14e'),
    );
    await world.applyBlockTexture(
      'Github Contribution L4',
      face,
      new Color('#216e39'),
    );
  }

  await world.applyBlockTexture('Orange Concrete', all, OrangeConcrete);
  await world.applyBlockTexture('Red Concrete', all, RedConcrete);
  await world.applyBlockTexture('Yellow Concrete', all, YellowConcrete);
  await world.applyBlockTexture('White Concrete', all, WhiteConcrete);
  await world.applyBlockTexture('Black Concrete', all, BlackConcrete);
  await world.applyBlockTexture('Blue Concrete', all, BlueConcrete);
  await world.applyBlockTexture('Glass', all, Glass);
  await world.applyBlockTexture(
    'Birch Log',
    ['px', 'nx', 'pz', 'nz'],
    BirchLogSide,
  );
  await world.applyBlockTexture('Birch Log', ['py', 'ny'], BirchLogTop);
  await world.applyBlockTexture(
    'Oak Log',
    ['px', 'nx', 'pz', 'nz'],
    OakLogSide,
  );
  await world.applyBlockTexture('Oak Log', ['py', 'ny'], OakLogTop);
  await world.applyBlockTexture('Oak Leaves', all, OakLeaves);
  await world.applyBlockTexture('Oak Leaves', ['one', 'two'], OakLeaves);
  await world.applyBlockTexture('Ivory', all, Ivory);
  await world.applyBlockTexture('Oak Planks', all, OakPlanks);
  await world.applyBlockTexture('Adminium', all, '/logo.png');

  await world.applyBlockTextures([
    {
      idOrName: 'Water',
      faceNames: all,
      source: Water,
    },
    {
      idOrName: 'Grass Block',
      faceNames: 'py',
      source: GrassBlockTop,
    },
    {
      idOrName: 'Grass Block',
      faceNames: ['px', 'nx', 'pz', 'nz'],
      source: GrassBlockSide,
    },
    {
      idOrName: 'Grass Block',
      faceNames: 'ny',
      source: Dirt,
    },
    {
      idOrName: 'Grass',
      faceNames: ['one', 'two'],
      source: Grass,
    },
    ...all.map((face) => ({
      idOrName: 'Torch',
      faceNames: `${face}head`,
      source: new Color('#FFF67E'),
    })),
    ...all.map((face) => ({
      idOrName: 'Torch',
      faceNames: `${face}body`,
      source: WhiteConcrete,
    })),
    {
      idOrName: 'Fence',
      faceNames: '*',
      source: OakLogSide,
    },
  ]);

  world.customizeMaterialShaders(
    'Grass',
    null,
    customShaders.sway({
      rooted: true,
    }),
  );

  world.customizeMaterialShaders(
    'Oak Leaves',
    null,
    customShaders.sway({
      yScale: 0,
    }),
  );
}
