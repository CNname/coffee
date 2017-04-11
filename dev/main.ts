declare function require(param1: string[], param2: Function): any;

interface Coord {
    x: number;
    y: number;
}

require(['./canvas-handler.class', './greedy.class', './aco.class'], (ch, g, a) => {

    const CanvasHandler = ch.CanvasHandler;
    const GreedyAlgorithm = g.GreedyAlgorithm;
    const AcoAlgorithm = a.AcoAlgorithm;
    let acoCanvas = new CanvasHandler('aco-canvas');
    let greedyCanvas = new CanvasHandler('greedy-canvas');
    const CANVAS_WIDTH: number = 600;
    const CANVAS_HEIGHT: number = 400;

    let getCoords = (amount: number): Array<Coord> => {

        let arr: Array<Coord> = [];

        for (let i = 0; i < amount; i++) {
            arr.push({
                x: Math.round(Math.random() * CANVAS_WIDTH),
                y: Math.round(Math.random() * CANVAS_HEIGHT)
            });
        }

        return arr;

    };

    let setCity = (ctx, coords: Coord, radius: number = 5, color: String = '#17192A') => {
        ctx.beginPath();
        ctx.arc(coords.x, coords.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    };

    // randomize city positions and hometown
    let cityConfig: { amount?: number; coords?: Array<Coord>; home?: number } = {};
    cityConfig.amount = parseInt(localStorage.getItem("cityCount")) || 50;
    cityConfig.coords = getCoords(cityConfig.amount);

    cityConfig.home = Math.round(Math.random() * cityConfig.amount);

    let drawCities = (ctx) => {

        for (let coord of cityConfig.coords) {

            // check if coord is home
            if (cityConfig.home === cityConfig.coords.indexOf(coord)) {
                setCity(ctx, coord, 10);
            } else {
                setCity(ctx, coord);
            }

        }

    }

    drawCities(greedyCanvas.getCtx());
    drawCities(acoCanvas.getCtx());

    // create greedy algorithm
    let greedy = new GreedyAlgorithm(cityConfig.home, cityConfig.coords);
    greedy.drawPath(greedyCanvas.getCtx());

    // Create ant colony
    let alpha = 1.0,
        beta = 2.0,
        q = 1.0,
        iterations = parseInt(localStorage.getItem("acoIterations")) || 100,
        pheromone = 1 / cityConfig.amount;

    function onNewBest(i, walk, length) {

        let canvas_arrow = (context: any, fromx: number, fromy: number, tox: number, toy: number) => {

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

        let drawPath = (ctx: any) => {

            // clear canvas
            ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            // draw cities
            drawCities(acoCanvas.getCtx());

            let coordsArray = cityConfig.coords;

            // length needs +1 because walk array has also the last return, thus 1 bigger than coordsArray
            for (let i=1; i<coordsArray.length+1; i++) {
                canvas_arrow(ctx, coordsArray[walk[i-1]].x, coordsArray[walk[i-1]].y, coordsArray[walk[i]].x, coordsArray[walk[i]].y);
            }

            // when every line is drawn, use stroke
            ctx.strokeStyle = '#17192A';
            ctx.stroke();

            // print total distance
            ctx.fillStyle = "#393b5b";
            ctx.font = "14px Arial";
            ctx.fillText("Kokonaispituus: " + Math.round(length) + 
            ", Kaupunkien määrä: " + cityConfig.amount + ", Iteraatiot: " + iterations, 10, 24);

        }

        drawPath(acoCanvas.getCtx());

    }

    let aco = new AcoAlgorithm(alpha, beta, q, iterations, pheromone);
    aco.init(JSON.parse(JSON.stringify(cityConfig.coords)));
    aco.setOnNewBest(onNewBest);
    aco.iterate(); // comment this in order to stop the console.log spam

});

(()=> {



})();