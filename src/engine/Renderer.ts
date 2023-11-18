import * as PIXI from "pixi.js";
import { Vector } from "./util/vector";
export * as Graphics from "pixi.js";

export class Renderer {
  app: PIXI.Application;
  constructor() {
    this.app = new PIXI.Application({
      backgroundColor: 0x1099bb,
      eventMode: "dynamic",
      eventFeatures: {
        globalMove: true,
      },
      antialias: true,
      autoStart: false,
      // resolution: window.devicePixelRatio || 1,
    });

    document.body.appendChild(this.app.view as HTMLCanvasElement);

    // Listen for window resize events
    window.addEventListener("resize", () => this.resize());
    this.resize();

    this.world = new PIXI.Container();

    this.app.stage.addChild(this.world);
  }

  world: PIXI.Container;

  transformScreenToWorld(screenPosition: Vector) {
    // transform screen position to world position
    const stagePosition = this.app.stage.position;
    const stageScale = this.app.stage.scale;
    const stageRotation = this.app.stage.rotation;

    // calculate the stage position
    const stagePositionX = screenPosition.x - stagePosition.x;
    const stagePositionY = screenPosition.y - stagePosition.y;
    const stagePositionVector = new Vector(stagePositionX, stagePositionY);
    const stagePositionVectorRotated = stagePositionVector.rotate(
      -stageRotation
    );

    // calculate the stage scale
    const stageScaleX = 1 / stageScale.x;
    const stageScaleY = 1 / stageScale.y;
    const stageScaleVector = new Vector(stageScaleX, stageScaleY);

    // calculate the stage position
    const worldPosition = stagePositionVectorRotated.scale(stageScaleVector);

    return worldPosition;
  }

  setCameraPosition(position: Vector) {
    // adjust for center of screen
    const [x, y] = position;
    this.app.stage.position.set(
      window.innerWidth / 2 - x,
      window.innerHeight / 2 - y
    );
  }

  resize() {
    // Resize the renderer
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
  }
}
