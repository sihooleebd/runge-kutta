import { RateDerivativeFn, State } from "./types.ts";


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






export class RungeKutta2 {
    deltaH: number;//in seconds
    private readonly rateDerivativeFn: RateDerivativeFn;
    constructor(rateDerivativeFn: RateDerivativeFn, dH: number) {
        this.rateDerivativeFn = rateDerivativeFn;
        this.deltaH = dH
    }

    step(currentState: State): State {
        if(currentState.value.dim != currentState.rate.dim) {
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

