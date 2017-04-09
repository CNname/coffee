import { Ant } from "./ant.class";
import { Colony } from './interfaces';

/**
 * Ant Colony Optimization algorithm
 */

export class AcoAlgorithm implements Colony {
    popSize: number; // size of the colony
    maxIterations: number;
    distances: Array<Array<number>>;
    alpha: number;
    beta: number;
    rho: number; // evaporation factor
    q: number;
    ip: number;
    population: Array<Ant>; // ants of the colony
    pheromone:number;
    pheromones: Array<Array<number>>;
    bestLength: number;
    bestSolution: number;
    goOn: boolean;
    onNewBest: Function;
    onIteration:Function;

    constructor(alpha:number, beta:number, q:number, iterations:number, pheromone:number) {
        this.population = [];
        this.alpha = alpha;
        this.beta = beta;
        this.q = q;
        this.maxIterations = iterations;
        this.pheromone = pheromone;

        this.rho = 0.1;

    }

    setOnNewBest(onNewBest:Function): void {
        this.onNewBest = onNewBest;
    }

    setOnIteration(onIteration:Function): void {
        this.onIteration = onIteration;
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

    }

    iterate(): void {
        let z = 0;
        let update = ((z)=>{
            setTimeout(()=>{
                this.sendOutAnts();
                this.updatePheromones();
                z++;
                this.daemonActions(z);
                if (z < this.maxIterations && this.goOn) {
                    console.log('iteration ' + (z + 1));
                    update(z);
                }
            }, 50);
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
       // console.log(this.pheromones);
    }

    evaporatePheromones(): void {
        for(let x = 0; x < this.distances.length; x++) {
            for(let y = 0; y < this.distances.length; y++) {
                if (x !== y) {
                    this.pheromones[x][y] = (1 - this.rho) * this.pheromones[x][y];
                } 
            }
        }
    }

    daemonActions(x:number): void {
        for(let i = 0; i < this.popSize; i++) {
            if (!this.bestSolution || this.population[i].walkLength < this.bestLength) {
                this.bestSolution = JSON.parse(JSON.stringify(this.population[i].walk));
                this.bestLength = JSON.parse(JSON.stringify(this.population[i].walkLength));
                if (this.onNewBest) {
                    this.onNewBest(x, this.bestSolution, this.bestLength);
                }
            }
        }
        /*if (this.onIteration) {
            this.onIteration(x, JSON.parse(JSON.stringify(this.pheromones)))
        }*/
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