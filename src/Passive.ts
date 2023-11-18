import { ColliderDesc } from "@dimforge/rapier2d";
import { CharacterEntity } from "./engine/CharacterEntity";
import { Physics } from "./engine/PhysicsEngine";
import { Graphics } from "./engine/Renderer";

export class Sheep extends CharacterEntity {
  createCollider(): ColliderDesc {
    return Physics.ColliderDesc.ball(0.5);
  }
  onInitGraphics(): void {
    const body = new Graphics.Graphics();

    // top down sheep, white ellipse
    body.lineStyle(5, 0xa19f9f);
    body.beginFill(0xd6d6d6);
    body.drawEllipse(0, 0, 50, 25);

    this.container.addChild(body);
  }
}
