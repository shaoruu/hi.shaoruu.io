import { AABB } from '@voxelize/aabb';
import { BlockUtils, type NetIntercept, type World } from '@voxelize/core';
import type { Engine } from '@voxelize/physics-engine';
import { RigidBody } from '@voxelize/physics-engine';
import type { MessageProtocol } from '@voxelize/transport';
import System, {
  Behaviour,
  Body,
  BoxZone,
  Emitter,
  Life,
  Mass,
  Position,
  Radius,
  Rate,
  Scale,
  Span,
} from 'three-nebula';

class Rigid extends Behaviour {
  constructor(
    public size: number,
    public impulse: number,
    public engine: Engine,
    life?: unknown,
    easing?: unknown,
    isEnabled = true,
  ) {
    super(life, easing, 'Rigid', isEnabled);
  }

  initialize(particle: any) {
    particle.rigidbody = new RigidBody(
      new AABB(0, 0, 0, this.size, this.size, this.size),
      1,
      1,
      0,
      1,
      0,
    );
    const { x, y, z } = particle.position;
    particle.rigidbody.applyImpulse([
      Math.random() * this.impulse * 2 - this.impulse,
      Math.random() * this.impulse * 2 - this.impulse,
      Math.random() * this.impulse * 2 - this.impulse,
    ]);
    particle.rigidbody.setPosition([x, y, z]);
    particle.rotation.set(
      Math.random() * 2 * Math.PI,
      Math.random() * 2 * Math.PI,
      Math.random() * 2 * Math.PI,
    );
  }

  mutate(particle: any) {
    this.engine.iterateBody(particle.rigidbody, 0.016, false);
    const [px, py, pz] = particle.rigidbody.getPosition();
    particle.position.set(px, py, pz);
  }
}

export class BreakParticles implements NetIntercept {
  public system = new System();

  public static PARTICLE_COUNT = 20;

  constructor(public world: World) {}

  onMessage = (message: MessageProtocol) => {
    if (message.type !== 'UPDATE') return;

    const { updates } = message;

    updates?.forEach(({ vx, vy, vz, voxel }) => {
      const oldID = this.world.getPreviousValueAt(vx, vy, vz);

      const newID = BlockUtils.extractID(voxel as number);

      if (oldID === 0 || newID !== 0) return;

      const mesh = this.world.makeBlockMesh(oldID);

      const emitter = new Emitter();
      emitter
        .setRate(
          new Rate(
            new Span(
              updates.length > 5 ? 0 : BreakParticles.PARTICLE_COUNT - 5,
              updates.length > 5 ? 1 : BreakParticles.PARTICLE_COUNT + 5,
            ),
            new Span(0.1, 0.25),
          ),
        )
        .addInitializers([
          new Mass(1),
          new Radius(1),
          new Life(2, 4),
          new Body(mesh),
          new Position(new BoxZone(1)),
        ])
        .addBehaviours([
          new Scale(0.1, 0.1),
          new Rigid(0.1, 3, this.world.physics),
        ])
        .setPosition({ x: vx + 0.5, y: vy + 0.5, z: vz + 0.5 })
        .addOnEmitterDeadEventListener(() => {
          this.system.removeEmitter(emitter);
        })
        .emit(1);

      this.system.addEmitter(emitter);
    });
  };
}
