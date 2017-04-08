export interface IAnt {
    alpha: number;
    beta: number;
    q: number;
    base: number;
    walk: Array<number>;
    walkLength: number;
    setBase(base: number): void;
    doWalk(distances: Array<Array<number>>, pheromones: Array<Array<number>>): void;
    chooseNext(currentNode: number, distances: Array<Array<number>>, pheromones: Array<Array<number>>): number;
    calcWalkLength(distances: Array<Array<number>>): number;
    layPheromones(pheromones: Array<Array<number>>): void;
}

export class Ant implements IAnt {

    alpha: number;
    beta: number;
    q: number;
    base: number;
    walk: Array<number>;
    walkLength: number;

    constructor(alpha: number, beta: number, q: number) {
        this.alpha = alpha;
        this.beta = beta;
        this.q = q;
        this.base = 0;
        this.walk = [];
        this.walkLength = null;
    }

    setBase(base: number): void {
        this.base = base;
    }

    doWalk(distances: Array<Array<number>>, pheromones: Array<Array<number>>): void {

        this.walk = [this.base];
        this.walkLength = null;
        for(let i = 1; i<distances.length; i++) {
            this.walk.push(this.chooseNext(this.walk[i-1], distances, pheromones));
        }
        this.walk.push(this.walk[0]); // finally walk home
        this.walkLength = this.calcWalkLength(distances);

    }

    chooseNext(currentNode: number, distances: Array<Array<number>>, pheromones: Array<Array<number>>): number {

        let sumall = 0;
        let unvisited = [];

        // check unvisited points
        for (let i=0; i<distances.length; i++) {
            if (this.walk.indexOf(i) === -1) {
                unvisited.push(i);
            }
        }

        // this needs some studying
        for (let i=0; i<pheromones.length; i++) {
            // not current and must be unvisited
            if (i !== currentNode && unvisited.indexOf(i) !== -1) {
                sumall += Math.pow(pheromones[currentNode][i], this.alpha) * Math.pow((1/distances[currentNode][i]), this.beta);
            }
        }

        let probs = [];
        let summul = 0;

        // this needs some studying
        for (let i=0; i<distances[currentNode].length; i++) {
            // not current and must be unvisited
            if (i !== currentNode && unvisited.indexOf(i) !== -1) {
                let mul = Math.pow(pheromones[currentNode][i], this.alpha) * Math.pow((1/distances[currentNode][i]), this.beta);
                probs.push(mul/sumall);
                summul += mul;
            }
        }

        let rand = Math.random();
        let x = 0;
        let tally = probs[x];
        while (rand > tally && x < probs.length - 1) {
            tally +=probs[++x];

        }

        return unvisited[x];

    }

    calcWalkLength(distances: Array<Array<number>>): number {

        let length = 0;
        for (let i=1; i < this.walk.length; i++) {
            length += distances[this.walk[i-1]][this.walk[i]];
        }

        return length;

    }

    layPheromones(pheromones: Array<Array<number>>): void {

        // this needs some studying
        for (let i=1; i<this.walk.length; i++) {
            pheromones[this.walk[i-1]][this.walk[i]] += (1/this.walkLength) * this.q;
            pheromones[this.walk[i]][this.walk[i-1]] += (1/this.walkLength) * this.q;
        }

    }

}