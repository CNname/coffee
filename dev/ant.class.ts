export interface IAnt {
    alpha: number;
    beta: number;
    q: number;
    base: number;
    walk: Array<number>;
    walkLength: number;
    doWalk(): void;
    chooseNext(): number;
    calcWalkLength(): number;
    layPheromones(): void;
}

export class Ant implements IAnt {

    alpha: number;
    beta: number;
    q: number;
    base: number;
    walk: Array<number>;
    walkLength: number;

    constructor() {
        console.log("ant constructoroitu");
    }

    doWalk(): void {
    }

    chooseNext(): number {
        return undefined;
    }

    calcWalkLength(): number {
        return undefined;
    }

    layPheromones(): void {
    }

}