import {
  createContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import {
  Character,
  Chat,
  ColorText,
  Events,
  Inputs,
  LightShined,
  Network,
  Peers,
  Perspective,
  RigidControls,
  Shadows,
  TRANSPARENT_SORT,
  VoxelInteract,
  World,
  artFunctions,
  type RigidControlsOptions,
  type WorldOptions,
} from '@voxelize/core';
import {
  EffectComposer,
  EffectPass,
  RenderPass,
  SMAAEffect,
} from 'postprocessing';
import * as THREE from 'three';
import { PerspectiveCamera, WebGLRenderer } from 'three';
import { MeshRenderer } from 'three-nebula';

import { BreakParticles } from '../core/particles';
import { makeRegistry } from '../core/registry';

const url = new URL(window.location.href);
if (url.origin.includes('localhost')) {
  url.port = '4000';
}
const serverUrl = url.toString();

ColorText.SPLITTER = '$';

export type VoxelizeContextData = {
  worldName: string;
  isConnecting: boolean;

  network: Network;
  world: World;
  rigidControls: RigidControls;
  inputs: Inputs<'menu' | 'in-game' | 'chat'>;
  peers: Peers<Character>;

  voxelInteract: VoxelInteract;
  shadows: Shadows;
  lightShined: LightShined;
  perspective: Perspective;

  camera: PerspectiveCamera;

  updateHooks: (() => void)[];
};

const VoxelizeContext = createContext<VoxelizeContextData>({} as any);

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
  const voxelInteractRef = useRef<VoxelInteract | null>(null);
  const shadowsRef = useRef<Shadows | null>(null);
  const lightShinedRef = useRef<LightShined | null>(null);
  const perspectiveRef = useRef<Perspective | null>(null);
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

    network.register(breakParticles);

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
        initialPosition: [0.5, 11, 0.5],
        // bodyHeight: 0.434210526 * Peers.MODEL_SCALE,
        flyForce: 200,
        ...rigidControlsOptions,
      },
    );

    renderer.setTransparentSort(TRANSPARENT_SORT(rigidControls.object));

    world.addChunkInitListener([0, 0], () => rigidControls.teleportToTop(0, 0));

    rigidControlsRef.current = rigidControls;

    /* -------------------------------------------------------------------------- */
    /*                          SETUP VOXEL INTERACTIONS                          */
    /* -------------------------------------------------------------------------- */
    const voxelInteract = new VoxelInteract(rigidControls.object, world, {
      highlightType: 'outline',
      highlightColor: new THREE.Color('#000'),
      highlightOpacity: 0.5,
      inverseDirection: true,
    });

    world.add(voxelInteract);

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

    inputsRef.current = inputs;

    /* -------------------------------------------------------------------------- */
    /*                                SETUP EFFECTS                               */
    /* -------------------------------------------------------------------------- */
    const lightShined = new LightShined(world);
    const shadows = new Shadows(world);

    /* -------------------------------------------------------------------------- */
    /*                                 SETUP PEERS                                */
    /* -------------------------------------------------------------------------- */

    function createCharacter() {
      const character = new Character();
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

    network.register(chat);
    network.register(events);

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

          breakParticles.system.update();
          voxelInteract.update();
          perspective.update();
          lightShined.update();
          shadows.update();

          updateHooks.forEach((hook) => hook());

          network.flush();
        }

        composer.render();
      };

      animate();

      await network.connect(serverUrl, {
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

      inputs.click(
        'left',
        () => {
          const { target } = voxelInteract;
          if (!target) return;
          world.updateVoxel(...target, 0);
        },
        'in-game',
      );

      inputs.click(
        'middle',
        () => {
          if (!voxelInteract.target) return;
          const [vx, vy, vz] = voxelInteract.target;
          const block = world.getBlockAt(vx, vy, vz);
          console.log(block);
        },
        'in-game',
      );

      inputs.click(
        'right',
        () => {
          if (!voxelInteract.potential) return;
          const {
            rotation,
            yRotation,
            voxel: [vx, vy, vz],
          } = voxelInteract.potential;

          const id = 1;
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

          world.updateVoxel(vx, vy, vz, id, rotation, yRotation);
        },
        'in-game',
      );

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
      voxelInteract: voxelInteractRef.current!,
      shadows: shadowsRef.current!,
      lightShined: lightShinedRef.current!,
      perspective: perspectiveRef.current!,
    };
  }, [isConnecting, worldName]);

  return (
    <VoxelizeContext.Provider value={{ ...memoedValue }}>
      {children}
    </VoxelizeContext.Provider>
  );
}
