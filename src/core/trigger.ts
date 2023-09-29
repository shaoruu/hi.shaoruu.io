import type { AABB } from '@voxelize/aabb';
import { NameTag, type RigidControls } from '@voxelize/core';
import { BoxGeometry, Group, Mesh, MeshBasicMaterial } from 'three';

export type TriggerCallback = (rigidControls: RigidControls) => void;

export class Triggers extends Group {
  constructor(public rigidControls: RigidControls) {
    super();

    this.visible = false;
  }

  toggleVisible = () => {
    this.visible = !this.visible;
  };

  set = (
    aabb: AABB,
    callback: TriggerCallback,
    { name }: Partial<{ name: string }> = {},
  ) => {
    const trigger = new Trigger(aabb, callback, { name });
    this.add(trigger);
    return trigger;
  };

  update = () => {
    this.children.forEach((trigger) => {
      if (!(trigger instanceof Trigger)) return;

      if (trigger.aabb.intersects(this.rigidControls.body.aabb)) {
        trigger.callback(this.rigidControls);
      }
    });
  };
}

export class Trigger extends Mesh {
  constructor(
    public aabb: AABB,
    public callback: TriggerCallback,
    { name }: Partial<{ name: string }> = {},
  ) {
    super(
      new BoxGeometry(aabb.width, aabb.height, aabb.depth),
      new MeshBasicMaterial({
        wireframe: true,
      }),
    );

    this.position.set(
      aabb.minX + aabb.width / 2,
      aabb.minY + aabb.height / 2,
      aabb.minZ + aabb.depth / 2,
    );

    if (name) {
      const nametag = new NameTag(name);
      this.attach(nametag);
      nametag.position.copy(this.position);
    }
  }
}
