export default class Vector {
  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static sub(v1: Vector, v2: Vector): Vector {
    return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
  }

  dist(v: Vector): number {
    return Math.sqrt((this.x - v.x) ** 2 + (this.y - v.y) ** 2);
  }

  /**
   *   Normalize the vector to length 1 (make it a unit
   *   vector).
   *   @return The normalized p5.Vector
   */
  normalize(): Vector {
    const len = this.mag();
    // here we multiply by the reciprocal instead of calling 'div()'
    // since div duplicates this zero check.
    if (len !== 0) this.mult(1 / len);
    return this;
  }

  /**
   *   Calculates the magnitude (length) of the vector
   *   and returns the result as a float. (This is simply
   *   the equation sqrt(x*x + y*y + z*z).)
   *   @return The magnitude of the vector
   */
  mag(): number {
    return Math.sqrt(this.magSq());
  }

  /**
   *   Calculates the squared magnitude of the vector and
   *   returns the result as a float. (This is simply the
   *   equation x*x + y*y + z*z.) Faster if the real
   *   length is not required in the case of comparing
   *   vectors, etc.
   *   @return The squared magnitude of the vector
   */
  magSq(): number {
    const { x, y, z } = this;
    return x * x + y * y + z * z;
  }

  mult(n: number): Vector {
    this.x *= n;
    this.y *= n;
    this.z *= n;
    return this;
  }

  add(value: Vector | number[]): Vector {
    if (value instanceof Vector) {
      this.x += value.x;
      this.y += value.y;
      this.z += value.z;
    } else if (value instanceof Array) {
      this.x += value[0];
      this.y += value[1];
      this.z += value[2];
    } else {
      this.x += value;
      this.y += value;
      this.z += value;
    }
    return this;
  }

  static add(v1: Vector, v2: Vector): Vector {
    return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
  }

  createVector(x: number, y: number, z?: number): Vector {
    return new Vector(x, y, z || 0);
  }

  /**
   *   The x component of the vector
   */
  x: number;

  /**
   *   The y component of the vector
   */
  y: number;

  /**
   *   The z component of the vector
   */
  z: number;
}
