import { Vector } from "./types.ts";


export class Oscillation {
    springConstant: number = 0;//in N/m
    mass: number = 0;//in kg
    amplitude: number = 0;
    omega: number = 0;

    constructor(mass, springConstant) {
        this.springConstant = springConstant;
        this.mass = mass;
        this.amplitude = this.mass * 10 / this.springConstant;
        this.omega = Math.sqrt(this.springConstant/this.mass);
    } 
    answerFunction = (t: number) => {
        return -this.amplitude*Math.sin(this.omega*t);
    }

    accelerator = (pos: Vector, rate: Vector) => {
        let posArr = pos.toArray()
        posArr = posArr.map(pi => {
            return - pi * this.springConstant / this.mass;
        });
        return new Vector(posArr);
    }
}
