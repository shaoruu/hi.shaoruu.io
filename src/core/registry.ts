import type { World } from '@voxelize/core';

import Amethyst from '../assets/images/blocks/amethyst.png';
import Andersite from '../assets/images/blocks/andersite_block.png';
import Aquamarine from '../assets/images/blocks/aquamarine.png';
import Azurite from '../assets/images/blocks/azurite.png';
import Basalt from '../assets/images/blocks/basalt_block.png';
import Bloodstone from '../assets/images/blocks/bloodstone.png';
import BlueLaceAgate from '../assets/images/blocks/blue_lace_agate.png';
import Chalk from '../assets/images/blocks/chalk_block.png';
import CondorAgate from '../assets/images/blocks/condor_agate.png';
import Coral from '../assets/images/blocks/coral.png';
import CrazyLaceAgate from '../assets/images/blocks/crazy_lace_agate.png';
import Diorite from '../assets/images/blocks/diorite_block.png';
import Emerald from '../assets/images/blocks/emerald.png';
import EnhydroAgate from '../assets/images/blocks/enhydro_agate.png';
import Flint from '../assets/images/blocks/flint.png';
import Gabbro from '../assets/images/blocks/gabbro_block.png';
import Granite from '../assets/images/blocks/granite_block.png';
import Graphite from '../assets/images/blocks/graphite_block.png';
import Hematite from '../assets/images/blocks/hematite.png';
import Iolite from '../assets/images/blocks/iolite.png';
import Jade from '../assets/images/blocks/jade.png';
import LapisLazuli from '../assets/images/blocks/lapis_lazuli.png';
import Limestone from '../assets/images/blocks/limestone_block.png';
import Malachite from '../assets/images/blocks/malachite.png';
import Marble from '../assets/images/blocks/marble_block.png';
import Moonstone from '../assets/images/blocks/moonstone.png';
import MossAgate from '../assets/images/blocks/moss_agate.png';
import Obsidian from '../assets/images/blocks/obsidian_block.png';
import OnyxAgate from '../assets/images/blocks/onyx_agate.png';
import Opal from '../assets/images/blocks/opal.png';
import Pumice from '../assets/images/blocks/pumice_block.png';
import Pyrite from '../assets/images/blocks/pyrite.png';
import Quartzite from '../assets/images/blocks/quartzite_block.png';
import RoseQuartz from '../assets/images/blocks/rose_quartz.png';
import Ruby from '../assets/images/blocks/ruby.png';
import SageniteAgate from '../assets/images/blocks/sagenite_agate.png';
import Sand from '../assets/images/blocks/sand_block.png';
import Sapphire from '../assets/images/blocks/sapphire.png';
import Scoria from '../assets/images/blocks/scoria_block.png';
import Stone from '../assets/images/blocks/stone.png';
import Sunstone from '../assets/images/blocks/sunstone.png';
import Tuff from '../assets/images/blocks/tuff_block.png';
import Turquoise from '../assets/images/blocks/turquoise.png';

export async function makeRegistry(world: World) {
  const all = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];

  await world.applyBlockTextures([
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
  ]);
}