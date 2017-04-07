/**
 * Homebrew - greedy algorithm,
 * which goes from closest points to another
 */
export class GreedyAlcorithm {

    private home: number; // index of coords which is home
    private coords: Array<{ x: number; y: number; }>;

    constructor(home: number, coords: Array<{ x: number; y: number; }>) {
        this.home = home;
        this.coords = coords;
    }

    /**
     *
     * @param pointArray
     * @param currentPosition
     * @returns {number} index of closest point
     */
    findClosestPoint(pointArray: Array<{ x: number; y: number; }>, currentPosition: number): number {

        const currentX: number = pointArray[currentPosition].x;
        const currentY: number = pointArray[currentPosition].y;
        let distArr: Array<{index: number; distance: number; }> = [];

        for (let i=0; i<pointArray.length; i++) {
            if (i !== currentPosition) {
                // get the subtraction of current distance and another
                let subX = Math.abs(currentX - pointArray[i].x);
                let subY = Math.abs(currentY - pointArray[i].y);
                // get the distance using pythagoras theorem
                let distance = Math.sqrt(Math.pow(subX, 2) + Math.pow(subY, 2));

                distArr.push({
                    index: i,
                    distance: distance
                });
            }
        }

        // creates own sort function which compares objects distance and sorts them
        distArr = distArr.sort((a, b) => {
            return a.distance - b.distance;
        });

        return distArr[0].index;

    }

    /**
     *
     * @param ctx is canvas context
     */
    drawPath(ctx: any) {

        let homeCoords = this.coords[this.home];
        let closest = this.coords[this.findClosestPoint(this.coords, this.home)];

        ctx.moveTo(homeCoords.x, homeCoords.y);
        ctx.lineTo(closest.x, closest.y);
        ctx.stroke();
    }



}