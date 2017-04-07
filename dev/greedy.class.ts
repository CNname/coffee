/**
 * Homebrew - greedy algorithm,
 * which goes from closest points to another
 */
export class GreedyAlgorithm {

    private home: number; // index of coords which is home
    private coords: Array<{ x: number; y: number; }>;

    constructor(home: number, coords: Array<{ x: number; y: number; }>) {
        this.home = home;
        this.coords = coords;
    }

    /**
     *
     * @param pointArray
     * @param currentCoords
     * @returns {{index: number, distance: number}}
     */
    findClosestPoint(pointArray: Array<{ x: number; y: number; }>, currentCoords: { x: number; y:number; }): { index: number; distance: number; } {

        const currentX: number = currentCoords.x;
        const currentY: number = currentCoords.y;
        let distArr: Array<{index: number; distance: number; }> = [];

        for (let i=0; i<pointArray.length; i++) {

            // get the subtraction of current distance and another
            let subX: number = currentX - pointArray[i].x,
                subY: number = currentY - pointArray[i].y;
            // get the distance using pythagoras theorem
            let distance = Math.sqrt(Math.pow(subX, 2) + Math.pow(subY, 2));

            distArr.push({
                index: i,
                distance: distance
            });

        }

        // creates own sort function which compares objects distance and sorts them
        distArr = distArr.sort((a, b) => {
            return a.distance - b.distance;
        });

        return distArr[0];

    }

    /**
     *
     * @param ctx is canvas context
     */
    drawPath(ctx: any) {

        // deep copy an array
        let coordsArray = JSON.parse(JSON.stringify(this.coords));
        // delete home from coordsArray
        coordsArray.splice(this.home, 1);
        let current = this.coords[this.home];

        let totalDistance: number = 0;

        while (coordsArray.length > 0) {
            let closestPoint = this.findClosestPoint(coordsArray, current);
            let closest = coordsArray[closestPoint.index];
            this.canvas_arrow(ctx, current.x, current.y, closest.x, closest.y);
            totalDistance += closestPoint.distance; // add distance to totalDistance
            current = closest;
            coordsArray.splice(closestPoint.index, 1);
        }

        // finally return home
        this.canvas_arrow(ctx, current.x, current.y, this.coords[this.home].x, this.coords[this.home].y);

        // when every line is drawn, use stroke
        ctx.strokeStyle = '#17192A';
        ctx.stroke();

        // print total distance
        ctx.fillStyle = "#393b5b";
        ctx.font = "14px Arial";
        ctx.fillText("Kokonaispituus: " + Math.round(totalDistance), 10, 24);

    }

    /**
     * Draw a line with arrow
     * @param context
     * @param fromx
     * @param fromy
     * @param tox
     * @param toy
     */
    canvas_arrow(context: any, fromx: number, fromy: number, tox: number, toy: number){

        let headlen = 5;   // length of head in pixels
        let angle = Math.atan2(toy-fromy,tox-fromx);
        let endx = tox-(headlen*2)*Math.cos(angle);
        let endy = toy-(headlen*2)*Math.sin(angle);

        context.moveTo(fromx, fromy);
        context.lineTo(endx, endy);
        context.lineTo(endx-headlen*Math.cos(angle-Math.PI/6),endy-headlen*Math.sin(angle-Math.PI/6));
        context.moveTo(endx, endy);
        context.lineTo(endx-headlen*Math.cos(angle+Math.PI/6),endy-headlen*Math.sin(angle+Math.PI/6));

    }

}