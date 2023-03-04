import { Tile, TILETYPE } from "./Tile";

export class GraphBoard {
    tiles:Tile[]=[];
    boxes:Tile[]=[];
    startPoint:Tile;
    endPoint:Tile;
    constructor(
        numX:number,
        numY:number,
        numBox:number
    ){
        this.createGrid(numX,numY);
        this.addBoxes(numBox);
        this.startPoint=this.addStartPoint();
        this.endPoint=this.addEndPoint();
    }
    createGrid(numX:number,numY:number){
        let index=0;
        for(let i=0;i<numX;i++){
            for(let j=0;j<numY;j++){
                index++;
                this.tiles.push(new Tile(index,i,j));
            }
        }
    }
    addBoxes(numBox: number) {
        for(let i=0;i<numBox;i++){
            const tile = this.getEmptyTile();
            tile.type=TILETYPE.BOX;
            this.boxes.push(tile);
        }
    }
    addStartPoint(){
        const tile = this.getEmptyTile();
        tile.type=TILETYPE.START;
        return tile;
    }
    addEndPoint(){
        const tile = this.getEmptyTile();
        tile.type=TILETYPE.END;
        return tile;
    }
    private getEmptyTile(){
        let rand =Math.floor(Math.random()*this.tiles.length);
        while(this.tiles[rand].type!=TILETYPE.EMPTY){
            rand =Math.floor(Math.random()*this.tiles.length);
        }
        return this.tiles[rand];
    }
    
}