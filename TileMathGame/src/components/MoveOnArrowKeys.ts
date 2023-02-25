
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class MoveOnArrowKeys {

	constructor(gameObject: Phaser.Physics.Arcade.Sprite) {
		this.gameObject = gameObject;
		(gameObject as any)["__MoveOnArrowKeys"] = this;

		/* START-USER-CTR-CODE */
		this.arrowKeys=gameObject.scene.input.keyboard.createCursorKeys();
		const speed = 200;
		this.arrowKeys.down.on("down",()=>{this.select(this.gameObject.x,this.gameObject.y+this.travel)});
		this.arrowKeys.up.on("down",()=>{this.select(this.gameObject.x,this.gameObject.y-this.travel)});
		this.arrowKeys.left.on("down",()=>{this.select(this.gameObject.x-this.travel,this.gameObject.y)});
		this.arrowKeys.right.on("down",()=>{this.select(this.gameObject.x+this.travel,this.gameObject.y)});
		this.arrowKeys.down.on("up",()=>{this.move('player-down')});
		this.arrowKeys.up.on("up",()=>{this.move('player-up')});
		this.arrowKeys.left.on("up",()=>{this.move('player-left')});
		this.arrowKeys.right.on("up",()=>{this.move('player-right')});
		/* END-USER-CTR-CODE */
	}

	static getComponent(gameObject: Phaser.Physics.Arcade.Sprite): MoveOnArrowKeys {
		return (gameObject as any)["__MoveOnArrowKeys"];
	}

	private gameObject: Phaser.Physics.Arcade.Sprite;

	/* START-USER-CODE */
	public travel:number=0;
	public follower:Phaser.GameObjects.PathFollower|undefined;
	arrowKeys: Phaser.Types.Input.Keyboard.CursorKeys;
	move(animationKey:string){
		console.log("key up");
		this.gameObject.visible=false;
		this.follower?.play(animationKey, true);
		this.follower?.startFollow({
			duration: 300,
			positionOnPath: true,
			repeat: 0,
			ease: 'Linear',
			delay: 40,
			loop:0,
			onComplete:()=>{
				console.log("on complete");
				this.stopFollower();
			}
		});
	}
	stopFollower(){
		this.follower?.stop();	
		this.follower?.stopFollow();
	}
	collided(){
		this.stopFollower();
		const point=this.follower?.path.getStartPoint();
		this.gameObject.setX(point?.x);
		this.gameObject.setY(point?.y);
		this.follower?.setX(point?.x);
		this.follower?.setY(point?.y);
	}
	select(x:number,y:number){
		console.log("select");

		this.gameObject.setY(y);
		this.gameObject.setX(x);
		this.follower?.path.destroy();
		this.follower?.setPath(new Phaser.Curves.Path(this.follower?.x, this.follower?.y));
		this.follower?.path.lineTo(x,y);
		this.gameObject.visible=true;
	}

	idle(){
		console.log("idle");
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
