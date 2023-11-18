import { Player } from "./Player";
import { Physics, PhysicsEntity } from "./engine/PhysicsEngine";
import { Graphics } from "./engine/Renderer";
import { World } from "./engine/World";
import { Vector } from "./engine/util/vector";

class TestEntity extends PhysicsEntity {
  getBodyDesc() {
    return Physics.RigidBodyDesc.fixed();
  }

  createColliders() {
    return [Physics.ColliderDesc.cuboid(1, 1)];
  }

  onInitGraphics(): void {
    const graphics = new Graphics.Graphics();
    // red square
    graphics.beginFill(0xffff00);
    graphics.drawRect(-100, -100, 200, 200);
    graphics.endFill();
    this.container.addChild(graphics);
  }

  onRender(): void {}

  _attachContainer() {
    this.world.renderer.app.stage.addChild(this.container);
  }
}

const world = new World();

const entity = new TestEntity();
world.addEntity(entity);
entity.transform.setPosition(new Vector(300, 300));

const player = new Player();

world.addEntity(player);
