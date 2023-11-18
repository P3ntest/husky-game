import { PhysicsEngine } from "./PhysicsEngine";
import { Entity } from "./Entity";
import { Renderer } from "./Renderer";
import { Ticker } from "./util/Ticker";
export class World {
  renderer: Renderer = new Renderer();
  physicsEngine: PhysicsEngine = new PhysicsEngine();
  physicsTicker: Ticker = new Ticker((n) => this.physicsTick(n));

  physicsTick(deltaTime: number) {
    for (const entity of this.entities) {
      entity.onUpdate(deltaTime);
    }
    this.physicsEngine.step();
    for (const entity of this.entities) {
      entity.onPostUpdate(deltaTime);
    }
  }

  renderTicks: number = 0;
  renderTick() {
    for (const entity of this.entities) {
      entity._syncTransformToContainer();
      entity.onRender(this.renderTicks);
    }
    this.renderer.app.render();
    requestAnimationFrame(() => this.renderTick());
    this.renderTicks++;
  }

  constructor() {
    console.log("Created World");

    this.physicsTicker.start();
    this.renderTick();
  }

  entities: Set<Entity> = new Set();

  addEntity(entity: Entity) {
    this.entities.add(entity);
    entity.world = this;
    entity.onAdd();
    entity.onInitGraphics();
    entity.onInitPhysics();
    entity._attachContainer();
  }

  removeEntity(entity: Entity) {
    this.entities.delete(entity);
  }
}
