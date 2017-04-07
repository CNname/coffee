/**
 * Ant Colony Optimization algorithm
 */
export interface Ant {
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

export interface Colony {
    popSize: number;
    maxIteration: number;
    distances: number;
    alpha: number;
    beta: number;
    pho: number
    q: number;
    ip: number;
    population: Array<Ant>;
    pheromones: Array<number>;
    bestLength: number;
    bestSolution: number;
    goOn: boolean; // continue
    onNewBest: number;
    setOnNewBest(): void;
    setOnIteration(): void;
    init(): void;
    iterate(): void;
    doWork(): void;
    sendOutAnts(): void;
    updatePheromones(): void;
    evaporatePheromones(): void;
    daemonActions(): void;
}

export class AcoAlgorithm {

    private ants: Array<Ant>;

    constructor() {

    }



}