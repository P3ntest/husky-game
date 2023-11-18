import RAPIER from "@dimforge/rapier2d";
export { RAPIER as Physics };
import { Entity, Transform } from "./Entity";
import { Vector } from "./util/vector";

export const PHYSICS_WORLD_SCALE = 100;

export class PhysicsEngine {
  world: RAPIER.World = new RAPIER.World(new RAPIER.Vector2(0, 0));

  constructor() {
    console.log("Created PhysicsEngine");
  }

  step() {
    this.world.step();
  }
}

export abstract class PhysicsEntity extends Entity {
  get transform(): Transform {
    return new RigidBodyTransform(this.body);
  }

  body!: RAPIER.RigidBody; // Late initialization by _attachToWorld
  colliders!: RAPIER.Collider[];

  lookAt(target: Vector) {
    const [x, y] = this.transform.getPosition();
    const [tx, ty] = target;
    const angle = Math.atan2(ty - y, tx - x);
    this.transform.setRotation(angle);
  }

  constructor() {
    super();
    console.log("Created PhysicsEntity");
  }

  onAdd(): void {
    this._attachToWorld();
  }

  _attachToWorld() {
    const bodyDesc = this.getBodyDesc();
    this.body = this.world.physicsEngine.world.createRigidBody(bodyDesc);

    const colliderDescs = this.createColliders();
    this.colliders = [];
    for (const colliderDesc of colliderDescs) {
      const collider = this.world.physicsEngine.world.createCollider(
        colliderDesc,
        this.body
      );
      this.colliders.push(collider);
    }
  }

  abstract createColliders(): RAPIER.ColliderDesc[];

  abstract getBodyDesc(): RAPIER.RigidBodyDesc;
}

export class RigidBodyTransform implements Transform {
  constructor(private body: RAPIER.RigidBody) {}

  getPosition() {
    return toVector(this.body.translation()).scale(PHYSICS_WORLD_SCALE);
  }

  getRotation() {
    return this.body.rotation();
  }

  setPosition(position: Vector) {
    this.body.setTranslation(
      fromVector(position.scale(1 / PHYSICS_WORLD_SCALE)),
      true
    );
  }

  setRotation(rotation: number) {
    this.body.setRotation(rotation, true);
  }
}

export function toVector(vec: RAPIER.Vector2): Vector {
  return new Vector(vec.x, vec.y);
}

export function fromVector(vec: Vector): RAPIER.Vector2 {
  return new RAPIER.Vector2(vec[0], vec[1]);
}
