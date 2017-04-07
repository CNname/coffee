declare function require(param1: string[], param2: Function): any;

interface Coord {
    x: number;
    y: number;
}

require(['./canvas-handler.class'], (res) => {

    const CanvasHandler = res.CanvasHandler;

    let acoCanvas = new CanvasHandler('aco-canvas');
    let greedyCanvas = new CanvasHandler('greedy-canvas');
    const CANVAS_WIDTH: number = 600;
    const CANVAS_HEIGHT: number = 400;

    // t.getCtx().moveTo(0,0);
    // t.getCtx().lineTo(200,200);
    // t.getCtx().stroke();

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

    let setCity = (ctx, coords: Coord) => {
        ctx.beginPath();
        ctx.arc(coords.x, coords.y, 5, 0, 2*Math.PI);
        ctx.fill();
    };

    // randomize city positions and hometown
    let cityConfig: { amount?: number; coords?: Array<Coord>; home?: number } = {};
    cityConfig.amount = 15;
    cityConfig.coords = getCoords(cityConfig.amount);
    cityConfig.home = Math.round(Math.random()*cityConfig.amount);

    for (let coord of cityConfig.coords) {
        setCity(acoCanvas.getCtx(), coord);
        setCity(greedyCanvas.getCtx(), coord);
    }

});