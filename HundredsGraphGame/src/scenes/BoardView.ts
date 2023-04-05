import { AnswerInput } from "../classes/AnswerInput";
import { GraphBoard } from "../classes/GraphBoard";
import MoveOnArrowKeys from "../classes/MoveOnArrowKeys";
import NumberSlider from "../classes/NumberSlider";
import { TILETYPE } from "../classes/Tile";

export default class BoardView extends Phaser.GameObjects.Container {
	constructor(scene: Phaser.Scene, x?: number, y?: number) {
		super(scene, x ?? 0, y ?? 0);

		//replace w/ json
		const numX=10;
		const numY=10;
		const tileSize=64;
		const numBoxes=10;
        const width=numX*tileSize;
		const height=numY*tileSize;

        //create board
        const board = new GraphBoard(numX,numY,numBoxes);
        const colliders=this.drawTiles(board,tileSize);
        this.drawGrid(width,height,tileSize);
        
        const playerStart={
            x:board.startPoint.x*tileSize,
            y:board.startPoint.y*tileSize
        };
        const player=this.drawPlayer(playerStart.x,playerStart.y,tileSize,colliders);
        player.setBounds(0,0,width,height);
    }
    
    drawPlayer(x:number,
        y:number,
        travel:number,
        colliders:Phaser.Types.Physics.Arcade.ImageWithDynamicBody[]){
        //cursor
        const cursor=this.scene.physics.add.sprite(x, y, "sokoban_spritesheet","environment_06.png");
        cursor.visible=true;
        this.add(cursor);

        //player character
		const playerPath = new Phaser.Curves.Path(cursor.x, cursor.y);
		const player=this.scene.add.follower(playerPath,cursor.x,cursor.y,"sokoban_spritesheet", "player_01.png");
		this.add(player);
		this.scene.physics.add.existing(player);

        //movement
        const controller=new MoveOnArrowKeys(cursor,()=>{
            
        });
		controller.follower=player;
		controller.travel=travel;

        //add physics
        this.scene.physics.add.collider(cursor,colliders,(body)=>{
            controller.collided();
        });
        return controller;
    }
    drawTiles(board:GraphBoard,tileSize:number){
        let colliders:Phaser.Types.Physics.Arcade.ImageWithDynamicBody[]=[];
        board.tiles.forEach((tile)=>{
            const x=tile.x*tileSize;
            const y=tile.y*tileSize;
            const tileImg = this.scene.add.image(x, y, "sokoban_spritesheet", "ground_06.png");
            this.add(tileImg);
            if(tile.type==TILETYPE.START){
                const start = this.scene.add.image(x, y, "sokoban_spritesheet", "ground_04.png");
                this.add(start);
            }
            if(tile.type==TILETYPE.END){
                const end = this.scene.add.image(x, y, "sokoban_spritesheet", "ground_02.png");
		        this.add(end);
            }
            if(tile.type==TILETYPE.BOX){
                let box = this.scene.physics.add.image(x, y, "sokoban_spritesheet", "crate_02.png");
                box.body.moves = false;
                box.body.allowGravity = false;
                box.body.allowDrag = false;
                box.body.allowRotation = false;
                box.body.pushable = false;
                box.body.immovable = true;
                box.body.setSize(64, 64, false);
                this.add(box);
                colliders.push(box);
            }
        });
        return colliders;
    }
    drawGrid(width:number,height:number,tileSize:number){
		let graphics = this.scene.add.graphics();
		this.add(graphics);
		graphics.lineStyle(1, 0xffffff, 1);

        //tiles get drawn from origin 0.5,0.5, but lines do not
        const minX=-tileSize/2;
        const minY=-tileSize/2;
		for(let i=minX;i<width;i+=tileSize){
			let path = new Phaser.Curves.Path(i,minY);
			path.lineTo(i,height+minY);
			path.draw(graphics);
		}
		for(let j=minY;j<height;j+=tileSize){
			let path = new Phaser.Curves.Path(minX,j);
			path.lineTo(width+minX,j);
			path.draw(graphics);
		}

        const top =minY;
        const left =minX;
        const right=width-left-tileSize;
        const bottom=height-minY-tileSize;

        graphics.lineStyle(3, 0x000000, 1);
        let topBoundary = new Phaser.Curves.Path(left,top);
        topBoundary.lineTo(right,top);
        topBoundary.draw(graphics);

        let bottomBoundary = new Phaser.Curves.Path(left,bottom);
        bottomBoundary.lineTo(right,bottom);
        bottomBoundary.draw(graphics);

        let rightBoundary = new Phaser.Curves.Path(right,top);
        rightBoundary.lineTo(right,bottom);
        rightBoundary.draw(graphics);

        let leftBoundary = new Phaser.Curves.Path(left,top);
        leftBoundary.lineTo(left,bottom);
        leftBoundary.draw(graphics);
	}

}