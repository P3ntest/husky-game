import { ColliderDesc } from "@dimforge/rapier2d";
import { CharacterEntity } from "./engine/CharacterEntity";
import { Physics, toVector } from "./engine/PhysicsEngine";
import { KeyboardController } from "./engine/util/KeyboardController";
import { Vector, findShortestDeltaAngle } from "./engine/util/vector";
import { Graphics } from "./engine/Renderer";
import { Input } from "./engine/util/Input";

export class Player extends CharacterEntity {
  createCollider(): ColliderDesc {
    return Physics.ColliderDesc.ball(0.5);
  }

  constructor() {
    super();
  }

  keyboardController = new KeyboardController();

  onAdd(): void {
    super.onAdd();
    this.keyboardController.attachTo(document.body);
    this.keyboardController.registerDefaults();
  }

  onRender(tick: number): void {
    const mousePosition = this.world.renderer.transformScreenToWorld(
      Input.getMousePosition()
    );

    // head rotation
    const thisRotation = this.transform.getRotation();
    const [thisX, thisY] = this.transform.getPosition();
    const [mouseX, mouseY] = mousePosition;
    const angle = Math.atan2(mouseY - thisY, mouseX - thisX);

    this.container.children[5].rotation = angle - thisRotation;

    const tailRotation = Math.sin(this.tailSwag) * 0.5;
    this.container.children[6].rotation = tailRotation;

    this.paws.forEach((paw, i) => {
      const pawPosition = Math.sin(this.pawMovement + i * 2) * 10;
      paw.position.set(pawPosition, 0);
    });

    const cameraDeltaPosition = this.transform
      .getPosition()
      .subtract(this.cameraPosition);

    const cameraSpeed = 0.07 * cameraDeltaPosition.length();

    const cameraDelta = cameraDeltaPosition.normalize().scale(cameraSpeed);

    this.cameraPosition = this.cameraPosition.add(cameraDelta);

    this.world.renderer.setCameraPosition(this.cameraPosition);

    const attackAnimationState = tick - this.attachAnimationStarted;
    if (attackAnimationState < 20) {
      const headPosition = (attackAnimationState - 50) / 50;
      const head = this.container.children[5];
      head.position.set(-headPosition * 20 + 40, 0);
    }
  }

  onInitGraphics(): void {
    const body = new Graphics.Graphics();

    // draw a top down gray wolf

    // paws
    for (const side of [-1, 1]) {
      for (const forward of [-1, 1]) {
        const paw = new Graphics.Graphics();
        // paw.pivot.set(0, 0);
        // paw.position.set(30 * forward - 10, 20 * side);

        paw.beginFill(0x555555);
        paw.lineStyle(5, 0xeeeeee);
        paw.drawEllipse(30 * forward - 10, 20 * side, 10, 10);
        paw.endFill();
        this.paws.push(paw);
      }
    }

    this.container.addChild(...this.paws);

    // body
    body.beginFill(0x333333);
    body.lineStyle(5, 0x555555);
    body.drawRoundedRect(-50, -20, 80, 40, 12);
    body.endFill();

    const head = new Graphics.Graphics();
    head.pivot.set(35, 0);
    head.position.set(40, 0);

    // head
    head.beginFill(0x333333);
    head.lineStyle(5, 0x555555);
    head.drawEllipse(40, 0, 20, 20);
    head.endFill();

    // eyes
    head.beginFill(0);
    head.lineStyle(6, 0x1975e6);
    head.beginFill();
    head.drawEllipse(45, -8, 2, 2);
    head.endFill();
    head.lineStyle(6, 0x8f5d31);
    head.drawEllipse(45, 8, 2, 2);
    head.endFill();

    // nose
    head.lineStyle(0, 0);
    head.beginFill(0x000000);
    head.drawEllipse(60, 0, 4, 4);
    head.endFill();

    // ears
    for (const side of [-1, 1]) {
      head.beginFill(0xffffff);
      head.lineStyle(5, 0x555555);
      head.drawEllipse(25, 13 * side, 6, 6);
      head.endFill();
    }

    // tail
    const tail = new Graphics.Graphics();
    tail.pivot.set(-40, 0);
    tail.position.set(-40, 0);

    tail.beginFill(0x333333);
    tail.lineStyle(5, 0x555555);
    tail.drawRoundedRect(-80, -10, 40, 20, 20);
    tail.endFill();

    this.container.addChild(body, head, tail);
  }

  paws: Graphics.Graphics[] = [];

  gap = 0.01;

  targetAngle = 0;
  tailSwag = 0;
  pawMovement = 0;

  attachAnimationStarted = -100;

  cameraPosition = new Vector(0, 0);

  onUpdate(deltaTime: number) {
    const horizontal = this.keyboardController.getAxis("Horizontal");
    const vertical = -this.keyboardController.getAxis("Vertical");
    const movement = new Vector(horizontal, vertical).normalize();

    if (this.keyboardController.downKeys.has(" ")) {
      this.attachAnimationStarted = this.world.renderTicks;
    }
    this.keyboardController.flushNewKeys();

    if (movement.length() > 0) {
      this.targetAngle = movement.angle();
      const angleDelta = findShortestDeltaAngle(
        this.transform.getRotation(),
        this.targetAngle
      );

      const angleSpeed = 0.1;
      const angleChange = angleDelta * angleSpeed;
      const newAngle = this.transform.getRotation() + angleChange;
      this.transform.setRotation(newAngle);
    }

    const maxSpeed = this.keyboardController.downKeys.has("ShiftLeft")
      ? 8
      : this.keyboardController.downKeys.has("AltLeft")
      ? 2
      : 5;
    const maxVelocity = movement.scale(maxSpeed);
    const currentVelocity = toVector(this.body.linvel());
    const acceleration = 0.2;
    const velocityDelta = maxVelocity.add(currentVelocity.inverse());
    const velocityChange = velocityDelta.scale(acceleration);
    const newVelocity = currentVelocity.add(velocityChange);

    const newTranslation = newVelocity.scale(deltaTime / 1000);

    this.tailSwag += currentVelocity.length() * 0.02;
    this.tailSwag += 0.2;
    this.pawMovement += currentVelocity.length() * 0.05;

    this.desiredTranslation = newTranslation;

    super.onUpdate(deltaTime);
  }
}
