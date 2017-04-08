import { Ant } from "./ant.class";

/**
 * Ant Colony Optimization algorithm
 */
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

export class AcoAlgorithm implements Colony {

    popSize: number;
    maxIteration: number;
    distances: number;
    alpha: number;
    beta: number;
    pho: number;
    q: number;
    ip: number;
    population: Array<Ant>;
    pheromones: Array<number>;
    bestLength: number;
    bestSolution: number;
    goOn: boolean;
    onNewBest: number;

    constructor() {
        // just for testing an Ant class
        this.population = [];
    }

    setOnNewBest(): void {
    }

    setOnIteration(): void {
    }

    init(): void {
        this.popSize = 20; // the amount of ants
        this.pheromones = [];
        this.bestSolution = null;
        this.goOn = true;
        for(let i = 0; i < this.popSize; i++) {
            this.population.push(new Ant()); 
        }
    }

    iterate(): void {
    }

    doWork(): void {
    }

    sendOutAnts(): void {
    }

    updatePheromones(): void {
    }

    evaporatePheromones(): void {
    }

    daemonActions(): void {
    }



}