declare function require(param1: string[], param2: Function): any;

interface Coord {
    x: number;
    y: number;
}

require(['./canvas-handler.class', './greedy.class'], (ch, g) => {

    const CanvasHandler = ch.CanvasHandler;
    const GreedyAlgorithm = g.GreedyAlgorithm;

    let acoCanvas = new CanvasHandler('aco-canvas');
    let greedyCanvas = new CanvasHandler('greedy-canvas');
    const CANVAS_WIDTH: number = 600;
    const CANVAS_HEIGHT: number = 400;

    let getCoords = (amount: number): Array<Coord> => {

        let arr: Array<Coord> = [];

        for (let i=0; i < amount; i++) {
            arr.push({
               x: Math.round(Math.random()*CANVAS_WIDTH),
               y: Math.round(Math.random()*CANVAS_HEIGHT)
            });
        }

        return arr;

    };
    
    let setCity = (ctx, coords: Coord, radius: number = 5, color:String = '#17192A') => {
        ctx.beginPath();
        ctx.arc(coords.x, coords.y, radius, 0, 2*Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    };

    // randomize city positions and hometown
    let cityConfig: { amount?: number; coords?: Array<Coord>; home?: number } = {};
    cityConfig.amount = 30;
    cityConfig.coords = getCoords(cityConfig.amount);
    cityConfig.home = Math.round(Math.random()*cityConfig.amount);

    for (let coord of cityConfig.coords) {

        // check if coord is home
        if (cityConfig.home === cityConfig.coords.indexOf(coord)) {
            setCity(acoCanvas.getCtx(), coord, 10);
            setCity(greedyCanvas.getCtx(), coord, 10);
        } else {
            setCity(acoCanvas.getCtx(), coord);
            setCity(greedyCanvas.getCtx(), coord);
        }

    }

    let greedy = new GreedyAlgorithm(cityConfig.home, cityConfig.coords);
    greedy.drawPath(greedyCanvas.getCtx());

});