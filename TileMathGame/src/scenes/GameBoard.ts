
// You can write more code here

/* START OF COMPILED CODE */

class GameBoard extends Phaser.GameObjects.Container {

	constructor(scene: Phaser.Scene, x?: number, y?: number) {
		super(scene, x ?? 0, y ?? 0);

		// rectangle_1
		const rectangle_1 = scene.add.rectangle(328, 334, 128, 128);
		rectangle_1.scaleX = 4.581297102599591;
		rectangle_1.scaleY = 4.4033804288654705;
		rectangle_1.isStroked = true;
		this.add(rectangle_1);

		// image_1
		const image_1 = scene.add.image(191, 155, "sokoban_spritesheet", "environment_06.png");
		this.add(image_1);

		/* START-USER-CTR-CODE */
		//replace w/ json
		const numX=10;
		const numY=10;
		const tileSize=64;
		const numBoxes=10;

		//create gameboard
		const width=numX*tileSize;
		const height=numY*tileSize;
		const tiles=this.createTiles(width,height,tileSize);
		this.createGrid(width,height,tileSize);

		const randEndTile = Math.floor(Math.random()*tiles.length);
		this.createEnd(tiles[randEndTile].x,tiles[randEndTile].y);

		let randStartTile =Math.floor(Math.random()*tiles.length);
		while(randStartTile==randEndTile){
			randStartTile =Math.floor(Math.random()*tiles.length);
		}

		const cursor=this.createStart(tiles[randStartTile].x,tiles[randStartTile].y);
		const boxes=this.createBlockList(numBoxes,tiles);

		const cursorController=new MoveOnArrowKeys(cursor);
		const playerPath = new Phaser.Curves.Path(cursor.x, cursor.y);
		const player=scene.add.follower(playerPath,cursor.x,cursor.y,"sokoban_spritesheet", "player_01.png");
		this.add(player);
		scene.physics.add.existing(player);

		cursorController.follower=player;
		cursorController.travel=tileSize;
		scene.physics.add.collider(player,boxes,()=>{
			console.log("collide");
			cursorController.stopFollower()
		});
		const left=this.minX+this.x;
		const top=this.minY+this.y;
		scene.physics.world.setBounds(left,top,width,height);
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */
	private minX=0;
	private minY=0;

	createStart(x:number,y:number){
		// start
		const start = this.scene.add.image(x, y, "sokoban_spritesheet", "ground_04.png");
		this.add(start);
		// player
		this.scene.physics.add.existing
		const cursor=this.scene.physics.add.sprite(x, y, "sokoban_spritesheet","environment_06.png");
		cursor.body.allowGravity = false;
		cursor.body.allowDrag = false;
		cursor.body.allowRotation = false;
		cursor.body.collideWorldBounds = true;
		cursor.body.setSize(cursor.width, cursor.height, false);
		cursor.visible=false;
		this.add(cursor);
		return cursor;
	}
	createBlockList(numBoxes:number,tiles:Phaser.GameObjects.Image[]){
		let blockList:Phaser.Physics.Arcade.Image[]=[];
		for(let i=0;i<numBoxes;i++){
			let randTile =Math.floor(Math.random()*tiles.length);
			let box = this.scene.physics.add.image(tiles[randTile].x, tiles[randTile].y, "sokoban_spritesheet", "crate_02.png");
			box.body.moves = false;
			box.body.allowGravity = false;
			box.body.allowDrag = false;
			box.body.allowRotation = false;
			box.body.pushable = false;
			box.body.immovable = true;
			box.body.setSize(64, 64, false);
			this.add(box);
			blockList.push(box);
		}
		return blockList;
	}
	createTiles(width:number,height:number,tileSize:number){
		const tiles=[];
		for(let i=this.minX+tileSize/2;i<width;i+=tileSize){
			for(let j=this.minY+tileSize/2;j<height;j+=tileSize){
				const tile = this.scene.add.image(i, j, "sokoban_spritesheet", "ground_06.png");
				this.add(tile);
				tiles.push(tile);
			}
		}
		return tiles;
	}
	createGrid(width:number,height:number,tileSize:number){
		let graphics = this.scene.add.graphics();
		this.add(graphics);
		graphics.lineStyle(1, 0xffffff, 1);
		for(let i=this.minX;i<=width;i+=tileSize){
			let path = new Phaser.Curves.Path(i,this.minY);
			path.lineTo(i,height);
			path.draw(graphics);
		}
		for(let j=this.minY;j<=height;j+=tileSize){
			let path = new Phaser.Curves.Path(this.minX,j);
			path.lineTo(width,j);
			path.draw(graphics);
		}
	}
	createEnd(x:number,y:number){
		// end
		const end = this.scene.add.image(x, y, "sokoban_spritesheet", "ground_02.png");
		this.add(end);
	}
	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
