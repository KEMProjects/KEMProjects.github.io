import Tile = require("./Tile");

export class GraphBoard {
    tiles:Tile[]=[];
    constructor(
        numX:number,
        numY:number,
        numBox:number
    ){
    this.createGrid(numX,numY);
    this.addBoxes(numBox);
    this.addStartPoint();
    this.addEndPoint();
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
            this.getEmptyTile().contains=Tile.TYPE.BOX;
        }
    }
    addStartPoint(){
        this.getEmptyTile().contains=Tile.TYPE.START;
    }
    addEndPoint(){
        this.getEmptyTile().contains=Tile.TYPE.END;
    }
    private getEmptyTile(){
        let rand =Math.floor(Math.random()*this.tiles.length);
        while(this.tiles[rand].contains!=Tile.TYPE.EMPTY){
            rand =Math.floor(Math.random()*this.tiles.length);
        }
        return this.tiles[rand];
    }
    
}