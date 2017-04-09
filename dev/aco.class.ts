import { Ant } from "./ant.class";

/**
 * Ant Colony Optimization algorithm
 */
export interface Colony {
    popSize: number;
    maxIterations: number;
    distances: Array<Array<number>>;
    alpha: number;
    beta: number;
    pho: number
    q: number;
    ip: number;
    population: Array<Ant>;
    pheromone:number;
    pheromones: Array<Array<number>>;
    bestLength: number;
    bestSolution: number;
    goOn: boolean; // continue
    onNewBest: number;
    setOnNewBest(): void;
    setOnIteration(): void;
    init(coords:any): void;
    iterate(): void;
    sendOutAnts(): void;
    updatePheromones(): void;
    evaporatePheromones(): void;
    daemonActions(x:number): void;
}

export class AcoAlgorithm implements Colony {
    popSize: number; // size of the colony
    maxIterations: number;
    distances: Array<Array<number>>;
    alpha: number;
    beta: number;
    pho: number;
    q: number;
    ip: number;
    population: Array<Ant>; // ants of the colony
    pheromone:number;
    pheromones: Array<Array<number>>;
    bestLength: number;
    bestSolution: number;
    goOn: boolean;
    onNewBest: number;

    constructor(alpha:number, beta:number, q:number, iterations:number, pheromone:number) {
        this.population = [];
        this.alpha = alpha;
        this.beta = beta;
        this.q = q;
        this.maxIterations = iterations;
        this.pheromone = pheromone;

        this.pho = 0.1;

    }

    setOnNewBest(): void {
    }

    setOnIteration(): void {
    }

    init(coords:any): void {
        this.popSize = 20; // the amount of ants
        this.pheromones = [];
        this.bestSolution = null;
        this.goOn = true;
        this.calculateDistances(coords);

        // create Ants
        for(let i = 0; i < this.popSize; i++) {
            this.population.push(new Ant(this.alpha, this.beta, this.q)); 
        }

        for(let x = 0; x < this.distances.length; x++) {
            this.pheromones[x] = [];
            for(let y = 0; y < this.distances.length; y++) {
                if (x !== y) {
                    this.pheromones[x][y] = this.pheromone;
                }
            }
        }

        console.log('Pheromones');
        console.log(this.pheromones);
    }

    iterate(): void {
        let z = 0;
        let update = ((z)=>{
            setTimeout(()=>{
                this.sendOutAnts();
                this.updatePheromones();
                z++;
                //this.daemonActions(z);
                if (z < this.maxIterations && this.goOn) {
                    console.log('iteration ' + z);
                    update(z);
                }
            }, 500);
        });
        update(z);
    }

    sendOutAnts(): void {
        for(let i = 0; i < this.popSize; i++) {
            this.population[i].doWalk(this.distances, this.pheromones);
        }
    }

    updatePheromones(): void {
        this.evaporatePheromones();
        for(let i = 0; i < this.popSize; i++) {
            this.population[i].layPheromones(this.pheromones);
        }
        console.log(this.pheromones);
    }

    evaporatePheromones(): void {
        for(let x = 0; x < this.distances.length; x++) {
            for(let y = 0; y < this.distances.length; y++) {
                if (x !== y) {
                    this.pheromones[x][y] = (1 - this.pho) * this.pheromones[x][y];
                } 
            }
        }
    }

    daemonActions(x:number): void {
    }

    calculateDistances(dist:Array<any>){
       this.distances = [];
       for (let i = 0; i < dist.length; i++) {
            this.distances[i] = [];
            for (let j = 0; j < dist.length; j++) {
                if (i !== j) {
                    let subX: number = dist[i].x - dist[j].x,
                        subY: number = dist[i].y - dist[j].y;
                    let distance = Math.sqrt(Math.pow(subX, 2) + Math.pow(subY, 2));
                    this.distances[i][j] = distance;
                }
            }
        }
    }


}