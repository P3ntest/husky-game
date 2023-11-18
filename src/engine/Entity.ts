import { World } from "./World";
import { Vector } from "./util/vector";
import * as PIXI from "pixi.js";

export abstract class Entity {
  world!: World; // Late initialization by World.addEntity

  constructor() {
    console.log("Created Entity");
  }

  /**
   * Called before physics update
   */
  onUpdate(deltaTime: number) {}

  /**
   * Called after physics update
   */
  onPostUpdate(deltaTime: number) {}

  /**
   * Called before rendering
   */
  onRender(tick: number) {}

  /**
   * Called when the entity is added to the world
   */
  onAdd() {}

  /**
   * Called when the entity is removed from the world
   */
  onRemove() {}

  /**
   * Called when the entity is added to the world
   */
  onInitGraphics() {}

  /**
   * Called when the entity is added to the world
   */
  onInitPhysics() {}

  _attachContainer() {
    this.world.renderer.world.addChild(this.container);
  }

  container: PIXI.Container = new PIXI.Container();
  _syncTransformToContainer() {
    const [x, y] = this.transform.getPosition();
    this.container.position.set(x, y);
    this.container.rotation = this.transform.getRotation();
  }

  abstract get transform(): Transform;
}

export abstract class NonPhysicalEntity extends Entity {
  transform: Transform = new NonPhysicalTransform();
}

export interface Transform {
  getPosition(): Vector;
  getRotation(): number;
  setPosition(position: Vector): void;
  setRotation(rotation: number): void;
}

export class NonPhysicalTransform implements Transform {
  position: Vector = new Vector(0, 0);
  rotation: number = 0;

  getPosition() {
    return this.position;
  }

  getRotation() {
    return this.rotation;
  }

  setPosition(position: Vector) {
    this.position = position;
  }

  setRotation(rotation: number) {
    this.rotation = rotation;
  }
}
