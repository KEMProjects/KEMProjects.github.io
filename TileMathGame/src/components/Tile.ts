class Tile{
    value:number;
    x:number;
    y:number;
    contains:Tile.TYPE;
    constructor(
        value:number,
        x:number,
        y:number
    ){
        this.value=value;
        this.y=y;
        this.x=x;
        this.contains=Tile.TYPE.EMPTY;
    }
}
namespace Tile{
    export enum TYPE{
        EMPTY,
        BOX,
        COIN,
        START,
        END
    }
}
export = Tile;