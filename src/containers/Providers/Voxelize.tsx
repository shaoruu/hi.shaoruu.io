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
  TRANSPARENT_SORT,
  VoxelInteract,
  World,
  artFunctions,
  type BlockUpdate,
  type Coords3,
  type RigidControlsOptions,
  type WorldOptions,
} from '@voxelize/core';
import { GUI } from 'lil-gui';
import {
  EffectComposer,
  EffectPass,
  RenderPass,
  SMAAEffect,
} from 'postprocessing';
import * as THREE from 'three';
import { PerspectiveCamera, WebGLRenderer } from 'three';
import { MeshRenderer } from 'three-nebula';

import { BreakParticles } from '../../core/particles';
import { makeRegistry } from '../../core/registry';

import {
  VoxelizeContext,
  type VoxelizeContextData,
} from '@/src/contexts/voxelize';
import { Triggers } from '@/src/core/trigger';
import { getCoreUrl } from '@/src/utils/urls';

ColorText.SPLITTER = '$';

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
  const peersRef = useRef<Peers<Character> | null>(null);
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
  const updateHooksRef = useRef<(() => void)[] | null>(null);

  const [isConnecting, setIsConnecting] = useState(true);

  useLayoutEffect(() => {
    if (networkRef.current) return;

    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

    const network = new Network();
    networkRef.current = network;

    /* -------------------------------------------------------------------------- */
    /*                                 SETUP WORLD                                */
    /* -------------------------------------------------------------------------- */
    const { world: worldOptions } = options;

    const world = new World({
      textureUnitDimension: 16,
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

    const rigidControls = new RigidControls(
      camera,
      renderer.domElement,
      world,
      {
        initialPosition: [0, 40, 0],
        flyForce: 100,
        flyImpulse: 1,
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
      reachDistance: 10,
    });

    world.add(voxelInteract);

    voxelInteractRef.current = voxelInteract;

    /* -------------------------------------------------------------------------- */
    /*                               SETUP TRIGGERS                               */
    /* -------------------------------------------------------------------------- */
    const triggers = new Triggers(rigidControls);

    const netSize = 500;
    const netHeight = 1;

    triggers.set(
      new AABB(-netSize, 0, -netSize, netSize, netHeight, netSize),
      () => {
        rigidControls.teleport(
          ...(rigidControls.options.initialPosition as Coords3),
        );
      },
      {
        name: 'Lobby Net',
      },
    );

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

    inputs.bind('f', rigidControls.toggleFly, 'in-game');
    inputs.bind('g', rigidControls.toggleGhostMode, 'in-game');

    const hideDebugUI = () => {
      debug.visible = !debug.visible;
      crosshairDom.style.display = debug.visible ? 'flex' : 'none';
      debug.dataWrapper.style.display = debug.visible ? 'block' : 'none';
      gui.domElement.style.display = debug.visible ? 'block' : 'none';
      triggers.toggleVisible();
    };

    inputs.bind('j', hideDebugUI, 'in-game');

    let radius = 1;
    const maxRadius = 10;
    const minRadius = 1;
    const circular = true;

    const bulkDestroy = () => {
      if (!voxelInteract.target) return;

      const [vx, vy, vz] = voxelInteract.target;

      const updates: BlockUpdate[] = [];

      for (let x = -radius; x <= radius; x++) {
        for (let y = -radius; y <= radius; y++) {
          for (let z = -radius; z <= radius; z++) {
            if (circular && x ** 2 + y ** 2 + z ** 2 > radius ** 2 - 1)
              continue;

            updates.push({
              vx: vx + x,
              vy: vy + y,
              vz: vz + z,
              type: 0,
            });
          }
        }
      }

      if (updates.length) world.updateVoxels(updates);
    };

    const bulkPlace = () => {
      if (!voxelInteract.potential) return;

      const {
        voxel: [vx, vy, vz],
        rotation,
        yRotation,
      } = voxelInteract.potential;

      const updates: BlockUpdate[] = [];
      const block = world.getBlockById(itemSlots.getFocused().content);

      for (let x = -radius; x <= radius; x++) {
        for (let y = -radius; y <= radius; y++) {
          for (let z = -radius; z <= radius; z++) {
            if (circular && x ** 2 + y ** 2 + z ** 2 > radius ** 2 - 1)
              continue;

            updates.push({
              vx: vx + x,
              vy: vy + y,
              vz: vz + z,
              type: block.id,
              rotation,
              yRotation,
            });
          }
        }
      }

      if (updates.length) world.updateVoxels(updates);
    };

    inputs.scroll(
      () => (radius = Math.min(maxRadius, radius + 1)),
      () => (radius = Math.max(minRadius, radius - 1)),
      'in-game',
    );

    const blocksToSkip = ['Youtube', 'Github', 'LinkedIn', 'Twitter', 'Mail'];

    inputs.click('right', () => {
      if (!voxelInteract.potential) return;

      const {
        voxel: [vx, vy, vz],
      } = voxelInteract.potential;

      // Check if target block has an action
      if (voxelInteract.target) {
        const [tvx, tvy, tvz] = voxelInteract.target || [0, 0, 0];
        const block = world.getBlockAt(tvx, tvy, tvz);
        if (blocksToSkip.includes(block?.name || '')) return;
      }

      const slot = itemSlots.getFocused();
      const id = slot.content;
      if (!id) return;

      const { aabbs } = world.getBlockById(id);
      if (
        aabbs.find((aabb) =>
          aabb
            .clone()
            .translate([vx, vy, vz])
            .intersects(rigidControls.body.aabb),
        )
      )
        return;

      bulkPlace();
    });

    inputs.click(
      'left',
      () => {
        const { target } = voxelInteract;
        if (!target) return;
        bulkDestroy();
      },
      'in-game',
    );

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
      },
      scrollable: false,
      activatedByDefault: true,
    });

    document.body.appendChild(itemSlots.element);

    itemSlotsRef.current = itemSlots;

    /* -------------------------------------------------------------------------- */
    /*                                 SETUP PEERS                                */
    /* -------------------------------------------------------------------------- */

    function createCharacter() {
      const character = new Character({
        nameTagOptions: {
          fontFace: 'ConnectionSerif-d20X',
        },
      });
      lightShined.add(character);
      shadows.add(character);
      return character;
    }

    const peers = new Peers<Character>(rigidControls.object);

    peers.createPeer = createCharacter;

    peers.onPeerUpdate = (object, data, info) => {
      object.set(data.position, data.direction);
      object.username = info.username;
    };

    const userCharacter = createCharacter();
    rigidControls.attachCharacter(userCharacter);

    world.add(peers);
    world.add(userCharacter);

    network.register(peers);

    peersRef.current = peers;

    /* -------------------------------------------------------------------------- */
    /*                               SETUP ENTITIES                               */
    /* -------------------------------------------------------------------------- */
    const entities = new Entities();

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
    debug.registerDisplay('Edit radius', () => radius);
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

    /* -------------------------------------------------------------------------- */
    /*                                   OTHERS                                   */
    /* -------------------------------------------------------------------------- */

    const updateHooks: (() => void)[] = [];
    updateHooksRef.current = updateHooks;

    const perspective = new Perspective(rigidControls, world);
    perspective.connect(inputs, 'in-game');

    const chat = new Chat();
    const events = new Events();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0);
    world.add(ambientLight);

    network.register(chat);
    network.register(events);

    chatRef.current = chat;

    /* -------------------------------------------------------------------------- */
    /*                                   CONNECT                                  */
    /* -------------------------------------------------------------------------- */

    let frame: any;

    async function start() {
      const animate = () => {
        frame = requestAnimationFrame(animate);

        network.sync();

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

          network.flush();
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

      gui.add(world, 'renderRadius', 3, 20, 1);
      gui
        .add({ time: world.time }, 'time', 0, world.options.timePerDay, 0.01)
        .onFinishChange((time: number) => {
          method.call('time', { time });
        });

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

      itemSlots.connect(inputs);

      debug.registerDisplay('Holding', () => {
        const slot = itemSlots.getFocused();
        if (!slot) return;

        const id = slot.getContent();
        if (!id) return;

        const block = world.getBlockById(id);
        return block ? `${block.name} (${block.id})` : '<Empty>';
      });

      // inputs.bind(
      //   'o',
      //   () => {
      //     const radius = 5;
      //     const base = 35;
      //     const height = 1;

      //     // const obsidianId = world.getBlockByName('Obsidian')!.id;
      //     const blockId = world.getBlockByName('Chalk Slab Bottom')!.id;
      //     const ringOnly = true;

      //     for (let x = -radius; x <= radius; x++) {
      //       for (let z = -radius; z <= radius; z++) {
      //         for (let y = base; y < base + height; y++) {
      //           if (x ** 2 + z ** 2 > radius ** 2) continue;
      //           if (ringOnly && x ** 2 + z ** 2 < (radius - 1) ** 2) continue;
      //           world.updateVoxel(x, y, z, blockId);
      //         }
      //       }
      //     }
      //   },
      //   '*',
      // );

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

  const memoedValue = useMemo<VoxelizeContextData>(() => {
    return {
      worldName,
      isConnecting,
      network: networkRef.current!,
      world: worldRef.current!,
      rigidControls: rigidControlsRef.current!,
      camera: cameraRef.current!,
      inputs: inputsRef.current!,
      updateHooks: updateHooksRef.current!,
      peers: peersRef.current!,
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
    };
  }, [isConnecting, worldName]);

  return (
    <VoxelizeContext.Provider value={{ ...memoedValue }}>
      {children}
    </VoxelizeContext.Provider>
  );
}
