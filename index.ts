import {Oscillation } from "./oscillation.ts";
import { Euler, RungeKutta2 } from "./RungeKutta.ts";
import { Vector } from "./types.ts";

function test() {
    //Tweak the constants below to change motion
    const mass = 1; // Kilograms
    const springConstant = 100;// Newtons per Meter
    const step = 0.01; //seconds
    //------------------------------------------




    
    const oscillation = new Oscillation(mass, springConstant);
    
    let curValueE = new Vector([0]);
    let curRateE = new Vector([-1]);
    let curValueR = new Vector([0]);
    let curRateR = new Vector([-1]);
    const euler = new Euler(oscillation.accelerator, step)
    const rk2 = new RungeKutta2(oscillation.accelerator, step)
    
    for(let time = 0; time <= 3; time += step) {
        console.log(time+", "+oscillation.answerFunction(time)+", "+curValueE.toArray()[0]+", "+curValueR.toArray()[0]);
        const resE = euler.step({value: curValueE, rate: curRateE});
        const resR = rk2.step({value: curValueR, rate: curRateR});
        curValueE = resE.value;
        curRateE = resE.rate;
        curValueR = resR.value;
        curRateR = resR.rate;
    }
}

test();
