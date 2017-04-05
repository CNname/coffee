import { CanvasHandler } from './canvas-handler.class';

console.log("moi");    

let t = new CanvasHandler('aco-canvas');
t.getCtx().moveTo(0,0);
t.getCtx().lineTo(200,200);
t.getCtx().stroke();
