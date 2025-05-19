export class Vector {
  private readonly _v: number[];
  readonly dim: number;

  constructor(values: number[]) {
    if (values.length === 0) {
      throw new Error("Vector must contain at least one component");
    }
    this._v = [...values];
    this.dim = values.length;
  }

  add(other: Vector): Vector {
    if (this.dim !== other.dim) {
      throw new Error(`Dimension mismatch: ${this.dim} vs ${other.dim}`);
    }
    const result = this._v.map((val, i) => val + other._v[i]);
    return new Vector(result);
  }

  scale(scalar: number): Vector {
    const result = this._v.map(val => val * scalar);
    return new Vector(result);
  }

  toArray(): number[] {
    return [...this._v];
  }
}

export type State = {
    value: Vector, 
    rate: Vector
}

export type RateDerivativeFn = (value: Vector, rate: Vector) => Vector;


