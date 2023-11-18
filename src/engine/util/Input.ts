import { Vector } from "./vector";

export class Input {
  static instance: Input = new Input();

  constructor() {
    window.addEventListener("mousemove", (e) => {
      this.mousePosition = new Vector(e.clientX ?? 0, e.clientY ?? 0);
    });
  }

  mousePosition: Vector = Vector.ZERO;

  static getMousePosition(): Vector {
    return Input.instance.mousePosition;
  }
}
