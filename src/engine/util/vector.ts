export class Vector {
  constructor(public x: number, public y: number) {}

  static get ZERO() {
    return new Vector(0, 0);
  }

  clone() {
    return new Vector(this.x, this.y);
  }

  scale(scalar: number | Vector) {
    if (scalar instanceof Vector) {
      return new Vector(this.x * scalar.x, this.y * scalar.y);
    }
    return new Vector(this.x * scalar, this.y * scalar);
  }

  angleTo(other: Vector) {
    // find the smallest angle between the two vectors
    const angle = Math.abs(this.angle() - other.angle());
    return Math.min(angle, Math.PI * 2 - angle);
  }

  angle() {
    return Math.atan2(this.y, this.x);
  }

  add(other: Vector) {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  subtract(other: Vector) {
    return new Vector(this.x - other.x, this.y - other.y);
  }

  rotate(angle: number) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
  }

  inverse() {
    return new Vector(-this.x, -this.y);
  }

  normalize() {
    const length = this.length();
    if (length === 0) {
      return Vector.ZERO;
    }
    return new Vector(this.x / length, this.y / length);
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  get 0() {
    return this.x;
  }

  get 1() {
    return this.y;
  }

  [Symbol.iterator]() {
    return [this.x, this.y][Symbol.iterator]();
  }
}

export function findShortestDeltaAngle(angle1: number, angle2: number) {
  angle1 = angle1 % (Math.PI * 2);
  if (angle1 < 0) {
    angle1 += Math.PI * 2;
  }
  angle2 = angle2 % (Math.PI * 2);
  if (angle2 < 0) {
    angle2 += Math.PI * 2;
  }
  let angleDelta = angle2 - angle1;
  if (angleDelta > Math.PI) {
    angleDelta -= Math.PI * 2;
  }
  if (angleDelta < -Math.PI) {
    angleDelta += Math.PI * 2;
  }
  return angleDelta;
}
