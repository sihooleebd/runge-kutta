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

  /**
   * Component-wise addition
   */
  add(other: Vector): Vector {
    if (this.dim !== other.dim) {
      throw new Error(`Dimension mismatch: ${this.dim} vs ${other.dim}`);
    }
    // console.log(this._v, other);

    const result = this._v.map((val, i) => val + other._v[i]);
    return new Vector(result);
  }

  /**
   * Scalar multiplication
   */
  scale(scalar: number): Vector {
    const result = this._v.map(val => val * scalar);
    // console.log(scalar, "Scale result: ", result);
    return new Vector(result);
  }

  /**
   * Returns raw array of components
   */
  toArray(): number[] {
    return [...this._v];
  }
}

export type State = {
    value: Vector, 
    rate: Vector
}

export type RateDerivativeFn = (value: Vector, rate: Vector) => Vector;


// -----------------------------------------------------------------------------
// Euler (RK‑1)
// -----------------------------------------------------------------------------
export class Euler {

    deltaH: number;//in seconds
    private readonly rateDerivativeFn: RateDerivativeFn;

    constructor(rateDerivativeFn: RateDerivativeFn, deltaH: number) {
        this.rateDerivativeFn = rateDerivativeFn;
        this.deltaH = deltaH;
    }

    step(state: State): State {
        if (state.value.dim !== state.rate.dim) {
            throw new Error("Value and rate vectors must have the same dimension");
        }

        const rateDerivative = this.rateDerivativeFn(state.value, state.rate);

        const nextValue = state.value.add(state.rate.scale(this.deltaH));
        const nextRate  = state.rate.add(rateDerivative.scale(this.deltaH));

        return { value: nextValue, rate: nextRate };
    }
}


class RungeKutta2 {
    deltaH: number;//in seconds
    private readonly rateDerivativeFn: RateDerivativeFn;
    constructor(rateDerivativeFn: RateDerivativeFn, dH: number) {
        this.rateDerivativeFn = rateDerivativeFn;
        this.deltaH = dH
    }

    step(currentState: State): State {
        if(currentState.value.dim != currentState.value.dim) {
            throw new Error(`Dimmensions do not match with Value: ${currentState.value.dim} vs Rate: ${currentState.rate.dim}`);
        }
        const p1value = currentState.value;
        const p1rate = currentState.rate;
        const p1rateDeriv = this.rateDerivativeFn(p1value, p1rate);

        const k1rate = p1rate;
        const k1rateDeriv = p1rateDeriv;

        const p2value = currentState.value.add(currentState.rate.scale(this.deltaH));
        const p2rate = currentState.rate.add(k1rateDeriv.scale(this.deltaH));
        const p2rateDeriv = this.rateDerivativeFn(p2value, p2rate)

        const k2rate = p2rate;
        const k2rateDeriv = p2rateDeriv;

        const nextValue = currentState.value.add(k1rate.scale(this.deltaH/2)).add(k2rate.scale(this.deltaH/2));
        const nextRate = currentState.rate.add(k1rateDeriv.scale(this.deltaH/2)).add(k2rateDeriv.scale(this.deltaH/2));
        return {value: nextValue, rate: nextRate};

    }
}


function test() {
    const step = 0.05
    let curValueE = new Vector([0]);
    let curRateE = new Vector([-1]);
    let curValueR = new Vector([0]);
    let curRateR = new Vector([-1]);
    const euler = new Euler(accel, step)
    const rk2 = new RungeKutta2(accel, step)
    
    for(let time = 0; time <= 3; time += step) {
        // console.log(time, answerFunction(time));
        console.log(time+", "+answerFunction(time)+", "+curValueE.toArray()[0]+", "+curValueR.toArray()[0]);
        const resE = euler.step({value: curValueE, rate: curRateE});
        const resR = rk2.step({value: curValueR, rate: curRateR});
        curValueE = resE.value;
        curRateE = resE.rate;
        curValueR = resR.value;
        curRateR = resR.rate;
    }
}

test();

function answerFunction(t: number) {
    return -0.1*Math.sin(10*t);
}

function accel(pos: Vector, rate: Vector) {
    let posArr = pos.toArray()
    
    // let newArr = []
    // posArr.forEach(pi => {
    //     newArr.push( - pi * 100 / 1);
    // });

    posArr = posArr.map(pi => {
         return - pi * 100 / 1;
    });

    // console.log(posArr);
    return new Vector(posArr);
}