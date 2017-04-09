import { Ant } from './ant.class'

export interface Colony {
    popSize: number;
    maxIterations: number;
    distances: Array<Array<number>>;
    alpha: number;
    beta: number;
    rho: number
    q: number;
    ip: number;
    population: Array<Ant>;
    pheromone:number;
    pheromones: Array<Array<number>>;
    bestLength: number;
    bestSolution: number;
    goOn: boolean; // continue
    onNewBest: Function;
    onIteration:Function;
    setOnNewBest(onNewBest:Function): void;
    setOnIteration(onIteration:Function): void;
    init(coords:any): void;
    iterate(): void;
    sendOutAnts(): void;
    updatePheromones(): void;
    evaporatePheromones(): void;
    daemonActions(x:number): void;
}