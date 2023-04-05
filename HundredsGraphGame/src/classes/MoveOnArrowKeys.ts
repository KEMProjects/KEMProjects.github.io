export default class MoveOnArrowKeys {

	constructor(gameObject: Phaser.GameObjects.Sprite,beforeMove:()=>void) {
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

	static getComponent(gameObject: Phaser.GameObjects.Sprite): MoveOnArrowKeys {
		return (gameObject as any)["__MoveOnArrowKeys"];
	}

	private gameObject: Phaser.GameObjects.Sprite;

	public travel:number=0;
	public follower:Phaser.GameObjects.PathFollower|undefined;
	arrowKeys: Phaser.Types.Input.Keyboard.CursorKeys;
	canMove:boolean=false;
	minX:number=0;
	minY:number=0;
	maxX:number=0;
	maxY:number=0;
	move(animationKey:string){
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
		this.gameObject.setY(y);
		this.gameObject.setX(x);
		this.follower?.path.destroy();
		this.follower?.setPath(new Phaser.Curves.Path(this.follower?.x, this.follower?.y));
		//need to set bounds collision here before creating a line, because the follower will follower even
		//after stopped in the collision function
		//the physics boundaries was changing the sprite location, possibly due to body origin being different?
		if(!this.withinBounds(x,y)){
			this.collided();
			return;
		}
		this.follower?.path.lineTo(x,y);
		this.gameObject.visible=true;
		this.canMove=true;
	}
	setBounds(left:number,top:number,right:number,bottom:number){
		this.minX=left;
		this.minY=top;
		this.maxX=right;
		this.maxY=bottom;
	}
	withinBounds(x:number,y:number){
		if(x>=this.minX&&x<this.maxX&&y>=this.minY&&y<this.maxY){
			return true;
		}
		return false;
	}
}
