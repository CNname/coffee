export class CanvasHandler {
    
    private ctx: any; // context reference
    
    constructor(canvasId: string){
        this.initCanvas(canvasId);
    }

    /**
     * Initialize canvas
     * @param canvasId id as a string
     */ 
    initCanvas(canvasId: string): any {
        try {
            let c: any = document.getElementById(canvasId);
            this.ctx = c.getContext('2d');
        } catch(err) {
            console.error(err);
        }
    }
    
    getCtx(): any {
        return this.ctx;
    }
    

}