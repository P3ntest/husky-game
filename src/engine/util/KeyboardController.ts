export class KeyboardController {
  attachTo(element: HTMLElement) {
    element.addEventListener("keydown", (e) => this.onKeyDown(e));
    element.addEventListener("keyup", (e) => this.onKeyUp(e));
    console.log("Attached KeyboardController to element");
  }

  downKeys: Set<string> = new Set();
  newKeys: Set<string> = new Set();

  axes: Record<string, Axis> = {};

  registerDefaults() {
    this.axes["Horizontal"] = {
      positive: ["ArrowRight", "d"],
      negative: ["ArrowLeft", "a"],
    };

    this.axes["Vertical"] = {
      positive: ["ArrowUp", "w"],
      negative: ["ArrowDown", "s"],
    };
  }

  getAxis(name: string): number {
    const axis = this.axes[name];
    if (!axis) {
      throw new Error(`Axis ${name} not found`);
    }

    const positive = axis.positive.some((key) => this.downKeys.has(key));
    const negative = axis.negative.some((key) => this.downKeys.has(key));

    return (positive ? 1 : 0) - (negative ? 1 : 0);
  }

  flushNewKeys() {
    this.newKeys.clear();
  }

  onKeyDown(e: KeyboardEvent) {
    this.downKeys.add(e.key);
    this.newKeys.add(e.key);
  }

  onKeyUp(e: KeyboardEvent) {
    this.downKeys.delete(e.key);
  }
}

type Axis = {
  positive: string[];
  negative: string[];
};
