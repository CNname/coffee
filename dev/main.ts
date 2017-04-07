// import { CanvasHandler } from './canvas-handler.class';
declare function require(param1: string[], param2: Function): any;
console.log("moi");    

require(['./canvas-handler.class'], (res) => {

    const CanvasHandler = res.CanvasHandler;

    let t = new CanvasHandler('aco-canvas');

    t.getCtx().moveTo(0,0);
    t.getCtx().lineTo(200,200);
    t.getCtx().stroke();

});