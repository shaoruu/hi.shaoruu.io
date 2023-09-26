import type { World } from '@voxelize/core';

import Andersite from '../assets/images/blocks/andersite_block.png';
import Basalt from '../assets/images/blocks/basalt_block.png';
import BlueLaceAgate from '../assets/images/blocks/blue_lace_agate.png';
import Chalk from '../assets/images/blocks/chalk_block.png';
import CondorAgate from '../assets/images/blocks/condor_agate.png';
import CrazyLaceAgate from '../assets/images/blocks/crazy_lace_agate.png';
import Diorite from '../assets/images/blocks/diorite_block.png';
import EnhydroAgate from '../assets/images/blocks/enhydro_agate.png';
import Gabbro from '../assets/images/blocks/gabbro_block.png';
import Granite from '../assets/images/blocks/granite_block.png';
import Graphite from '../assets/images/blocks/graphite_block.png';
import Limestone from '../assets/images/blocks/limestone_block.png';
import Marble from '../assets/images/blocks/marble_block.png';
import MossAgate from '../assets/images/blocks/moss_agate.png';
import Obsidian from '../assets/images/blocks/obsidian_block.png';
import OnyxAgate from '../assets/images/blocks/onyx_agate.png';
import Pumice from '../assets/images/blocks/pumice_block.png';
import Quartzite from '../assets/images/blocks/quartzite_block.png';
import SageniteAgate from '../assets/images/blocks/sagenite_agate.png';
import Sand from '../assets/images/blocks/sand_block.png';
import Scoria from '../assets/images/blocks/scoria_block.png';
import Stone from '../assets/images/blocks/stone.png';
import Tuff from '../assets/images/blocks/tuff_block.png';

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
  ]);
}
