export default class MoveOnArrowKeys {

	constructor(gameObject: Phaser.Physics.Arcade.Sprite) {
		this.gameObject = gameObject;
		(gameObject as any)["__MoveOnArrowKeys"] = this;

		this.arrowKeys=gameObject.scene.input.keyboard.createCursorKeys();
		this.arrowKeys.down.on("down",()=>{this.select(this.gameObject.x,this.gameObject.y+this.travel)});
		this.arrowKeys.up.on("down",()=>{this.select(this.gameObject.x,this.gameObject.y-this.travel)});
		this.arrowKeys.left.on("down",()=>{this.select(this.gameObject.x-this.travel,this.gameObject.y)});
		this.arrowKeys.right.on("down",()=>{this.select(this.gameObject.x+this.travel,this.gameObject.y)});
		this.arrowKeys.down.on("up",()=>{this.move('player-down')});
		this.arrowKeys.up.on("up",()=>{this.move('player-up')});
		this.arrowKeys.left.on("up",()=>{this.move('player-left')});
		this.arrowKeys.right.on("up",()=>{this.move('player-right')});
	}

	static getComponent(gameObject: Phaser.Physics.Arcade.Sprite): MoveOnArrowKeys {
		return (gameObject as any)["__MoveOnArrowKeys"];
	}

	private gameObject: Phaser.Physics.Arcade.Sprite;

	public travel:number=0;
	public follower:Phaser.GameObjects.PathFollower|undefined;
	arrowKeys: Phaser.Types.Input.Keyboard.CursorKeys;
	canMove:boolean=false;
	move(animationKey:string){
		console.log("key up");
		this.gameObject.visible=false;
		if(!this.canMove){
			const point=this.follower?.path.getStartPoint();
			this.gameObject.setX(point?.x);
			this.gameObject.setY(point?.y);
			return;
		}
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
		this.canMove=false;
		this.stopFollower();
		const point=this.follower?.path.getStartPoint();
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
		this.canMove=true;
	}

}
