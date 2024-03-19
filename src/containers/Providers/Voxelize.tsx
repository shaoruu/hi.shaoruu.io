import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { AABB } from '@voxelize/aabb';
import {
  Character,
  Chat,
  ColorText,
  Debug,
  Entities,
  Entity,
  Events,
  Inputs,
  ItemSlots,
  LightShined,
  Method,
  Network,
  Peers,
  Perspective,
  RigidControls,
  Shadows,
  SpriteText,
  TRANSPARENT_SORT,
  VoxelInteract,
  World,
  artFunctions,
  type Coords3,
  type RigidControlsOptions,
  type WorldOptions,
} from '@voxelize/core';
import { GUI } from 'dat.gui';
import {
  EffectComposer,
  EffectPass,
  RenderPass,
  SMAAEffect,
} from 'postprocessing';
import * as THREE from 'three';
import { PerspectiveCamera, WebGLRenderer } from 'three';
import { MeshRenderer } from 'three-nebula';

import Amethyst from '../../assets/images/blocks/amethyst.png';
import BlueLaceAgate from '../../assets/images/blocks/blue_lace_agate.png';
import Diorite from '../../assets/images/blocks/diorite_block.png';
import MossAgate from '../../assets/images/blocks/moss_agate.png';
import { BreakParticles } from '../../core/particles';
import { makeRegistry } from '../../core/registry';

import {
  currentWorldName,
  knownWorlds,
  voxelizeWorldLocalStorageKey,
} from '@/src/constants';
import {
  VoxelizeContext,
  type VoxelizeContextData,
} from '@/src/contexts/voxelize';
import { BlockEntities } from '@/src/core/block-entities';
import { Trigger, Triggers } from '@/src/core/trigger';
import type { ChatItem } from '@/src/types';
import { isAdmin } from '@/src/utils/isAdmin';
import { getCoreUrl } from '@/src/utils/urls';

ColorText.SPLITTER = '$';

const emptyQ = new THREE.Quaternion();
const emptyP = new THREE.Vector3();

type Props = {
  worldName: string;
  canvasId: string;
  children?: ReactNode;
  options?: Partial<{
    world: Partial<WorldOptions>;
    rigidControls: Partial<RigidControlsOptions>;
  }>;
};

const emptyObject = {};

export type PeerRole = 'OWNER' | 'GUEST';

export type PeersData = {
  direction: number[];
  position: number[];
  role: PeerRole;
};

function paintCharacterByRole(character: Character, role: PeerRole) {
  if (role === 'GUEST' || !role) {
    // ...copied from voxelize
    character.head.paint('all', new THREE.Color('#96baff'));
    character.head.paint('front', new THREE.Color('#f99999'));
    character.body.paint('all', new THREE.Color('#2b2e42'));
    character.leftArm.paint('all', new THREE.Color('#548ca8'));
    character.rightArm.paint('all', new THREE.Color('#548ca8'));
    character.leftLeg.paint('all', new THREE.Color('#96baff'));
    character.rightLeg.paint('all', new THREE.Color('#96baff'));
  } else {
    const loader = new THREE.TextureLoader();
    loader.load(Amethyst, (texture) => {
      character.body.paint('all', texture);
    });
    loader.load(MossAgate, (texture) => {
      character.head.paint('all', texture);
      character.head.paint('front', new THREE.Color('#f99999')); // Medium Sea Green
    });
    loader.load(BlueLaceAgate, (texture) => {
      character.leftArm.paint('all', texture);
      character.rightArm.paint('all', texture);
    });
    loader.load(Diorite, (texture) => {
      character.leftLeg.paint('all', texture);
      character.rightLeg.paint('all', texture);
    });
  }
}

export function VoxelizeProvider({
  canvasId,
  worldName,
  children,
  options = emptyObject,
}: Props) {
  const networkRef = useRef<Network | null>(null);
  const rigidControlsRef = useRef<RigidControls | null>(null);
  const worldRef = useRef<World | null>(null);
  const cameraRef = useRef<PerspectiveCamera | null>(null);
  const inputsRef = useRef<Inputs<'menu' | 'in-game' | 'chat'>>();
  const peersRef = useRef<Peers<Character, PeersData> | null>(null);
  const methodRef = useRef<Method | null>(null);
  const entitiesRef = useRef<Entities | null>(null);
  const itemSlotsRef = useRef<ItemSlots | null>(null);
  const voxelInteractRef = useRef<VoxelInteract | null>(null);
  const shadowsRef = useRef<Shadows | null>(null);
  const lightShinedRef = useRef<LightShined | null>(null);
  const perspectiveRef = useRef<Perspective | null>(null);
  const triggersRef = useRef<Triggers | null>(null);
  const debugRef = useRef<Debug | null>(null);
  const guiRef = useRef<GUI | null>(null);
  const chatRef = useRef<Chat | null>(null);
  const blockEntitiesRef = useRef<BlockEntities | null>(null);
  const updateHooksRef = useRef<(() => void)[] | null>(null);

  const [isConnecting, setIsConnecting] = useState(true);

  useLayoutEffect(() => {
    if (networkRef.current) return;

    const isUserAdmin = isAdmin();

    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

    const network = new Network();
    networkRef.current = network;

    /* -------------------------------------------------------------------------- */
    /*                                 SETUP WORLD                                */
    /* -------------------------------------------------------------------------- */
    const { world: worldOptions } = options;

    const world = new World({
      textureUnitDimension: 16,
      maxUpdatesPerUpdate: 1000,
      ...worldOptions,
    });

    world.sky.setShadingPhases([
      // start of sunrise
      {
        name: 'sunrise',
        color: {
          top: new THREE.Color('#7694CF'),
          middle: new THREE.Color('#B0483A'),
          bottom: new THREE.Color('#222'),
        },
        skyOffset: 0.05,
        voidOffset: 0.6,
        start: 0.2,
      },
      // end of sunrise
      {
        name: 'daylight',
        color: {
          top: new THREE.Color('#73A3FB'),
          middle: new THREE.Color('#B1CCFD'),
          bottom: new THREE.Color('#222'),
        },
        skyOffset: 0,
        voidOffset: 0.6,
        start: 0.25,
      },
      // start of sunset
      {
        name: 'sunset',
        color: {
          top: new THREE.Color('#A57A59'),
          middle: new THREE.Color('#FC5935'),
          bottom: new THREE.Color('#222'),
        },
        skyOffset: 0.05,
        voidOffset: 0.6,
        start: 0.7,
      },
      // end of sunset
      {
        name: 'night',
        color: {
          top: new THREE.Color('#000'),
          middle: new THREE.Color('#000'),
          bottom: new THREE.Color('#000'),
        },
        skyOffset: 0.1,
        voidOffset: 0.6,
        start: 0.75,
      },
    ]);

    world.sky.paint('bottom', artFunctions.drawSun());
    world.sky.paint('top', artFunctions.drawStars());
    world.sky.paint('top', artFunctions.drawMoon());
    world.sky.paint('sides', artFunctions.drawStars());

    worldRef.current = world;

    network.register(world);

    /* -------------------------------------------------------------------------- */
    /*                                SETUP CAMERA                                */
    /* -------------------------------------------------------------------------- */
    const camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      3000,
    );

    cameraRef.current = camera;

    /* -------------------------------------------------------------------------- */
    /*                               SETUP PARTICLES                              */
    /* -------------------------------------------------------------------------- */
    const breakParticles = new BreakParticles(world);
    breakParticles.system.addRenderer(new MeshRenderer(world, THREE));

    /* -------------------------------------------------------------------------- */
    /*                                SETUP METHOD                                */
    /* -------------------------------------------------------------------------- */
    const method = new Method();

    network.register(method);

    methodRef.current = method;

    /* -------------------------------------------------------------------------- */
    /*                               SETUP RENDERER                               */
    /* -------------------------------------------------------------------------- */

    const renderer = new WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      canvas,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const composer = new EffectComposer(renderer);

    composer.addPass(new RenderPass(world, camera));
    composer.addPass(new EffectPass(camera, new SMAAEffect({})));

    /* -------------------------------------------------------------------------- */
    /*                            SETUP RIGID CONTROLS                            */
    /* -------------------------------------------------------------------------- */
    const { rigidControls: rigidControlsOptions } = options;
    const directionProbabilities = [
      { direction: [1, 0, 0] as [number, number, number], probability: 0.35 },
      { direction: [-1, 0, 0] as [number, number, number], probability: 0.75 },
      { direction: [0, 0, -1] as [number, number, number], probability: 0.88 },
      { direction: [0, 0, 1] as [number, number, number], probability: 1 },
    ];

    const randomValue = Math.random();
    const initialDirection =
      directionProbabilities.find(
        ({ probability }) => randomValue < probability,
      )?.direction || ([0, 0, 0] as [number, number, number]);

    const rigidControls = new RigidControls(
      camera,
      renderer.domElement,
      world,
      {
        initialPosition: [0, 40, 0],
        initialDirection:
          worldName === 'main'
            ? initialDirection
            : ([0, 0, 0] as [number, number, number]),
        flyForce: 500,
        flyImpulse: 3,
        ...rigidControlsOptions,
      },
    );

    renderer.setTransparentSort(TRANSPARENT_SORT(rigidControls.object));

    rigidControlsRef.current = rigidControls;

    /* -------------------------------------------------------------------------- */
    /*                          SETUP VOXEL INTERACTIONS                          */
    /* -------------------------------------------------------------------------- */
    const voxelInteract = new VoxelInteract(rigidControls.object, world, {
      highlightType: 'outline',
      highlightColor: new THREE.Color('#000'),
      highlightOpacity: 0.5,
      inverseDirection: true,
      reachDistance: 32,
    });

    world.add(voxelInteract);

    voxelInteractRef.current = voxelInteract;

    /* -------------------------------------------------------------------------- */
    /*                               SETUP TRIGGERS                               */
    /* -------------------------------------------------------------------------- */
    const triggers = new Triggers(rigidControls);

    triggersRef.current = triggers;

    /* -------------------------------------------------------------------------- */
    /*                                SETUP INPUTS                                */
    /* -------------------------------------------------------------------------- */
    const inputs = new Inputs<'menu' | 'in-game' | 'chat'>();

    rigidControls.connect(inputs, 'in-game');

    rigidControls.on('lock', () => {
      inputs.setNamespace('in-game');
    });

    rigidControls.on('unlock', () => {
      inputs.setNamespace('menu');
    });

    if (isUserAdmin) {
      inputs.bind('f', rigidControls.toggleFly, 'in-game');
      inputs.bind('g', rigidControls.toggleGhostMode, 'in-game');
    }

    const hideUI = () => {
      debug.visible = !debug.visible;
      debug.dataWrapper.style.display = debug.visible ? 'block' : 'none';
      gui.domElement.style.display = debug.visible ? 'block' : 'none';
      crosshairDom.style.display = debug.visible ? 'block' : 'none';
      itemSlots.element.style.display = debug.visible ? 'block' : 'none';
      triggers.toggleVisible();
    };

    if (isUserAdmin) {
      inputs.bind('j', hideUI, 'in-game');
    }

    inputsRef.current = inputs;

    /* -------------------------------------------------------------------------- */
    /*                                SETUP EFFECTS                               */
    /* -------------------------------------------------------------------------- */
    const lightShined = new LightShined(world);
    const shadows = new Shadows(world);

    /* -------------------------------------------------------------------------- */
    /*                               SETUP INVENTORY                              */
    /* -------------------------------------------------------------------------- */
    const itemSlots = new ItemSlots({
      verticalCount: 1,
      horizontalCount: 10,
      wrapperStyles: {
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: '100000000000000',
      },
      scrollable: false,
      activatedByDefault: true,
    });

    document.body.appendChild(itemSlots.element);

    itemSlotsRef.current = itemSlots;

    /* -------------------------------------------------------------------------- */
    /*                                 SETUP PEERS                                */
    /* -------------------------------------------------------------------------- */

    function createCharacter(forceOwner?: boolean) {
      const character = new Character({
        nameTagOptions: {
          fontFace: 'ConnectionSerif-d20X',
        },
      });

      // paint as guest by default
      paintCharacterByRole(character, forceOwner ? 'OWNER' : 'GUEST');

      lightShined.add(character);
      shadows.add(character);
      return character;
    }

    const peers = new Peers<Character, PeersData>(rigidControls.object);

    peers.createPeer = () => createCharacter();
    peers.packInfo = () => {
      const {
        x: dx,
        y: dy,
        z: dz,
      } = new THREE.Vector3(0, 0, -1)
        .applyQuaternion(rigidControls.object.getWorldQuaternion(emptyQ))
        .normalize();
      const {
        x: px,
        y: py,
        z: pz,
      } = rigidControls.object.getWorldPosition(emptyP);

      const queryUsername = new URLSearchParams(window.location.search).get(
        'username',
      );

      return {
        id: peers.ownID,
        username: isUserAdmin
          ? `$red$[OWNER] $white$${queryUsername ?? 'Ian'}`
          : queryUsername
          ? `$white$${queryUsername}`
          : `$gray$${peers.ownUsername}`,
        metadata: {
          position: [px, py, pz],
          direction: [dx, dy, dz],
          role: isUserAdmin ? 'OWNER' : 'GUEST',
        },
      };
    };

    peers.onPeerUpdate = (object, data, info) => {
      object.set(data.position, data.direction);
      object.username = info.username;

      // User role change
      if (!object.extraData) object.extraData = {};
      if (object.extraData.role !== data.role) {
        paintCharacterByRole(object, data.role);
        object.extraData.role = data.role;
      }
    };

    const userCharacter = createCharacter(isUserAdmin);
    rigidControls.attachCharacter(userCharacter);

    world.add(peers);
    world.add(userCharacter);

    network.register(peers);

    peersRef.current = peers;

    /* -------------------------------------------------------------------------- */
    /*                               SETUP ENTITIES                               */
    /* -------------------------------------------------------------------------- */
    const entities = new Entities();

    class FloatingText extends Entity<{ position: Coords3; text: string }> {
      textMesh = new SpriteText('', 0.2);

      constructor(id: string) {
        super(id);

        this.textMesh.material.depthWrite = false;
        this.textMesh.material.depthTest = false;
        this.textMesh.material.transparent = true;
        this.textMesh.fontFace = 'ConnectionSerif-d20X';
        this.textMesh.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        this.add(this.textMesh);
      }

      onCreate = (data: { position: Coords3; text: string }) => {
        this.textMesh.text = data.text.replace(/\\n/, '\n');
        this.position.set(...data.position);
      };

      onUpdate = (data: { position: Coords3; text: string }) => {
        this.textMesh.text = data.text.replace(/\\n/, '\n');
        this.position.set(...data.position);
      };
    }

    type BotData = {
      position: Coords3;
      rotation: [number, number, number, number];
      target: Coords3;
      path: {
        maxNodes: number;
        path: Coords3[];
      };
    };

    const botPaths = new THREE.Group();
    const botCharacters = new Map<string, Character>();

    world.add(botPaths);

    class Bot extends Entity<BotData> {
      entityId: string;
      character: Character;
      path = new THREE.Group();

      constructor(id: string) {
        super(id);

        this.entityId = id;

        this.character = new Character({
          nameTagOptions: {
            fontFace: 'ConnectionSerif-d20X',
          },
        });
        this.character.username = "$#B4D4FF$Ian's Bot";

        // shadows.add(this.character);
        // lightShined.add(this.character);

        this.character.head.paint('all', new THREE.Color('#F99417'));
        this.character.head.paint('front', new THREE.Color('#F4CE14'));

        this.character.scale.set(0.5, 0.5, 0.5);
        this.character.position.y += this.character.totalHeight / 4;
        this.add(this.character);

        botPaths.add(this.path);

        botCharacters.set(id, this.character);
      }

      adjustPosition = (position: Coords3) => {
        position[1] += this.character.totalHeight / 4;
        return position;
      };

      onCreate = (data: BotData) => {
        const adjustedPosition = this.adjustPosition(data.position);
        this.character.set(adjustedPosition, [0, 0, 0]);
      };

      onDelete = () => {
        this.path.children.forEach((node) => {
          this.path.remove(node);
        });

        botPaths.remove(this.path);
        botCharacters.delete(this.entityId);
      };

      onUpdate = (data: BotData) => {
        const { position, target } = data;

        const adjustedPosition = this.adjustPosition(position);

        const origin = this.character.position;

        const [tx, ty, tz] = target || [0, 0, 0];
        const delta = new THREE.Vector3(tx, ty, tz).sub(origin);
        const direction = delta.clone().normalize();

        this.character.set(adjustedPosition, direction.toArray());

        this.path.children.forEach((node) => {
          this.path.remove(node);
        });

        const { path } = data;

        if (path.path) {
          const { path: nodes } = path;

          for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const color = new THREE.Color('#fff');
            const geometry = new THREE.PlaneGeometry(1, 1);
            geometry.rotateX(-Math.PI / 2);
            const material = new THREE.MeshBasicMaterial({
              color,
              opacity: 0.1,
              transparent: true,
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(...node);
            mesh.position.addScalar(0.5);
            mesh.position.y -= 0.49;
            this.path.add(mesh);
          }
        }
      };
    }

    entities.setClass('floating-text', FloatingText);
    entities.setClass('bot', Bot);
    world.add(entities);

    const blockEntities = new BlockEntities(world);
    blockEntitiesRef.current = blockEntities;

    network.register(entities);

    entitiesRef.current = entities;

    /* -------------------------------------------------------------------------- */
    /*                                 SETUP DEBUG                                */
    /* -------------------------------------------------------------------------- */
    const debug = new Debug(document.body, {
      dataStyles: {
        top: '10px',
        left: '10px',
        position: 'fixed',
        zIndex: '1000',
        color: '#fff',
        backgroundColor: 'var(--color-overlay)',
        padding: '8px',
        fontSize: '12px',
        border: '2px solid var(--color-text-primary)',
      },
    });

    const gui = new GUI();
    gui.domElement.style.top = '10px';

    const crosshairDom = document.getElementById('crosshair') as HTMLDivElement;

    debug.registerDisplay('Current voxel', rigidControls, 'voxel');
    debug.registerDisplay('Current chunk', rigidControls, 'chunk');
    debug.registerDisplay('Time', () => {
      return `${Math.floor(
        (world.time / world.options.timePerDay) * 100,
      )}% (${world.time.toFixed(2)})`;
    });

    debug.registerDisplay('Sunlight', () => {
      return world.getSunlightAt(...rigidControls.voxel);
    });

    debug.registerDisplay('Voxel Stage', () => {
      return world.getVoxelStageAt(...rigidControls.voxel);
    });

    debug.registerDisplay(
      'Chunks to Request',
      world.chunks.toRequest,
      'length',
    );
    debug.registerDisplay('Chunks Requested', world.chunks.requested, 'size');
    debug.registerDisplay(
      'Chunks to Process',
      world.chunks.toProcess,
      'length',
    );
    debug.registerDisplay('Chunks Loaded', world.chunks.loaded, 'size');
    debug.registerDisplay('Target voxel', voxelInteract, 'target');

    ['Red', 'Green', 'Blue'].forEach((color) => {
      debug.registerDisplay(`${color} Light`, () => {
        return world.getTorchLightAt(
          ...rigidControls.voxel,
          color.toUpperCase() as any,
        );
      });
    });

    debugRef.current = debug;
    guiRef.current = gui;

    /* -------------------------------------------------------------------------- */
    /*                                  LISTENERS                                 */
    /* -------------------------------------------------------------------------- */

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio || 1);
      composer.setSize(window.innerWidth, window.innerHeight);
    });

    if (worldName === 'terrain') {
      world.addChunkInitListener([0, 0], () =>
        rigidControls.teleportToTop(0, 0),
      );
    }

    /* -------------------------------------------------------------------------- */
    /*                                   OTHERS                                   */
    /* -------------------------------------------------------------------------- */

    const updateHooks: (() => void)[] = [];
    updateHooksRef.current = updateHooks;

    updateHooks.push(() => {
      botCharacters.forEach((bot) => bot.update());
    });

    const perspective = new Perspective(rigidControls, world);
    perspective.connect(inputs, 'in-game');

    const chat = new Chat();
    const events = new Events();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0);
    world.add(ambientLight);

    network.register(chat);
    network.register(events);

    chatRef.current = chat;

    if (worldName === 'main') {
      triggers.add(
        new Trigger(
          new AABB(-19, 35, -2, -18, 38, 1),
          () => {
            localStorage.setItem(voxelizeWorldLocalStorageKey, 'flat');
            window.location.reload();
          },
          {
            name: 'flat',
          },
        ),
      );
    } else {
      triggers.add(
        new Trigger(
          new AABB(-10000, -1, -10000, 10000, 0, 10000),
          () => {
            localStorage.setItem(voxelizeWorldLocalStorageKey, 'main');
            window.location.reload();
          },
          {
            name: 'main',
          },
        ),
      );
    }

    /*                                   CONNECT                                  */
    /* -------------------------------------------------------------------------- */

    let frame: any;

    async function start() {
      const animate = () => {
        frame = requestAnimationFrame(animate);

        if (world.isInitialized) {
          peers.update();
          rigidControls.update();

          const inWater =
            world.getBlockAt(
              ...camera.getWorldPosition(new THREE.Vector3()).toArray(),
            )?.name === 'Water';
          const fogNear = inWater
            ? 0.1 * world.options.chunkSize * world.renderRadius
            : 0.7 * world.options.chunkSize * world.renderRadius;
          const fogFar = inWater
            ? 0.8 * world.options.chunkSize * world.renderRadius
            : world.options.chunkSize * world.renderRadius;
          const fogColor = inWater
            ? new THREE.Color('#5F9DF7')
            : new THREE.Color('#B1CCFD');

          world.chunks.uniforms.fogNear.value = THREE.MathUtils.lerp(
            world.chunks.uniforms.fogNear.value,
            fogNear,
            0.08,
          );

          world.chunks.uniforms.fogFar.value = THREE.MathUtils.lerp(
            world.chunks.uniforms.fogFar.value,
            fogFar,
            0.08,
          );

          world.chunks.uniforms.fogColor.value.lerp(fogColor, 0.08);

          world.update(
            rigidControls.object.position,
            camera.getWorldDirection(new THREE.Vector3()),
          );

          breakParticles.update();
          voxelInteract.update();
          perspective.update();
          lightShined.update();
          shadows.update();
          triggers.update();
          debug.update();

          updateHooks.forEach((hook) => hook());

          ambientLight.intensity = Math.min(
            Math.max(world.time / world.options.timePerDay, 0.2),
            Math.max(
              world.getSunlightAt(...rigidControls.voxel) /
                world.options.maxLightLevel,
              0.2,
            ) * 2,
          );

          if (rigidControls.voxel[1] < -5) {
            rigidControls.teleport(0, 40, 0);
          }
        }

        composer.render();
      };

      animate();

      await network.connect(getCoreUrl(), {
        secret: 'test',
      });
      await network.join(worldName);

      await world.loader.load();
      await world.initialize();
      await makeRegistry(world);

      /* -------------------------------------------------------------------------- */
      /*                         POST-INTIALIZE PREPARATIONS                        */
      /* -------------------------------------------------------------------------- */
      world.chunks.uniforms.fogNear.value = 2000;
      world.chunks.uniforms.fogFar.value = 3000;
      world.renderRadius = 8;

      gui
        .add({ world: currentWorldName }, 'world', knownWorlds)
        .onChange((worldName: string) => {
          localStorage.setItem(voxelizeWorldLocalStorageKey, worldName);
          window.location.reload();
        });

      const saveKey = 'voxelizeGuiSettings';
      const loadGuiData = () => {
        const savedData = localStorage.getItem(saveKey);
        return savedData ? JSON.parse(savedData) : { alwaysSprint: true };
      };

      const rememberedGuiData = loadGuiData();

      gui.add(rememberedGuiData, 'alwaysSprint').onChange((value) => {
        rigidControls.options.alwaysSprint = value;
        localStorage.setItem(
          saveKey,
          JSON.stringify({ ...rememberedGuiData, alwaysSprint: value }),
        );
      });

      rigidControls.options.alwaysSprint = rememberedGuiData.alwaysSprint;

      if (isUserAdmin) {
        gui.add(world, 'renderRadius', 3, 20, 1);
        gui
          .add({ time: world.time }, 'time', 0, world.options.timePerDay, 0.01)
          .onFinishChange((time: number) => {
            method.call('time', { time });
          });
      }

      ['1', '2', '3', '4', '5', '6', '7', '8', '9'].forEach((key) => {
        inputs.bind(
          key,
          () => {
            const index = parseInt(key);
            itemSlots.setFocused(0, index - 1);
          },
          'in-game',
        );
      });

      const zoomedFactor = 3;
      const zoomLerpFactor = 0.1;
      let targetZoomFactor = 1;

      inputs.bind(
        'z',
        () => {
          targetZoomFactor = zoomedFactor;
        },
        'in-game',
        {
          occasion: 'keydown',
        },
      );
      inputs.bind(
        'z',
        () => {
          targetZoomFactor = 1;
        },
        'in-game',
        {
          occasion: 'keyup',
        },
      );

      updateHooks.push(() => {
        camera.zoom = THREE.MathUtils.lerp(
          camera.zoom,
          targetZoomFactor,
          zoomLerpFactor,
        );
        camera.updateProjectionMatrix();
      });

      itemSlots.connect(inputs);

      debug.registerDisplay('Holding', () => {
        const slot = itemSlots.getFocused();
        if (!slot) return;

        const id = slot.getContent();
        if (!id) return;

        const block = world.getBlockById(id);
        return block ? `${block.name} (${block.id})` : '<Empty>';
      });

      if (isUserAdmin) {
        gui.add(rigidControls.options, 'flyForce', 100, 600, 0.1);
        gui.add(
          {
            'Spawn Bot': () => {
              method.call('spawn-bot', {
                position: rigidControls.object.position.toArray(),
              });
            },
          },
          'Spawn Bot',
        );
      }

      setIsConnecting(false);
    }

    start();

    return () => {
      if (network.connected) {
        network.disconnect();
      }

      cancelAnimationFrame(frame);
    };
  }, [canvasId, options, worldName]);

  const [chatItems, setChatItems] = useState<ChatItem[]>([]);

  const memoedValue = useMemo<
    Omit<
      VoxelizeContextData,
      'chatItems' | 'setChatItems' | 'worldName' | 'isConnecting'
    >
  >(() => {
    return {
      network: networkRef.current!,
      world: worldRef.current!,
      rigidControls: rigidControlsRef.current!,
      camera: cameraRef.current!,
      inputs: inputsRef.current!,
      updateHooks: updateHooksRef.current!,
      peers: peersRef.current!,
      entities: entitiesRef.current!,
      method: methodRef.current!,
      chat: chatRef.current!,
      voxelInteract: voxelInteractRef.current!,
      shadows: shadowsRef.current!,
      lightShined: lightShinedRef.current!,
      perspective: perspectiveRef.current!,
      debug: debugRef.current!,
      triggers: triggersRef.current!,
      gui: guiRef.current!,
      itemSlots: itemSlotsRef.current!,
      blockEntities: blockEntitiesRef.current!,
    };
  }, [isConnecting, worldName]);

  return (
    <VoxelizeContext.Provider
      value={{
        ...memoedValue,
        isConnecting,
        worldName,
        chatItems,
        setChatItems,
      }}
    >
      {children}
    </VoxelizeContext.Provider>
  );
}
