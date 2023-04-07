export default class MoveOnArrowKeys {
	selected:(x:number,y:number)=>void=()=>{};
	constructor(gameObject: Phaser.GameObjects.Sprite) {
		this.gameObject = gameObject;
		(gameObject as any)["__MoveOnArrowKeys"] = this;

		this.arrowKeys=gameObject.scene.input.keyboard.createCursorKeys();
		const afterSelect=(animationKey:string)=>{
			if(this.followerCanMove){
				this.animationKey=animationKey;
				this.selected(this.gameObject.x,this.gameObject.y);
			}
		};
		this.arrowKeys.down.on("down",()=>{
			if(!this.selectorCanMove){
				return;
			}
			this.select(this.gameObject.x,this.gameObject.y+this.travel);
		});
		this.arrowKeys.down.on("up",()=>{
			afterSelect("player-down");
		});
		this.arrowKeys.up.on("down",()=>{
			if(!this.selectorCanMove){
				return;
			}
			this.select(this.gameObject.x,this.gameObject.y-this.travel);
		});
		this.arrowKeys.up.on("up",()=>{
			afterSelect("player-up");
		});
		this.arrowKeys.left.on("down",()=>{
			if(!this.selectorCanMove){
				return;
			}
			this.select(this.gameObject.x-this.travel,this.gameObject.y);
		});
		this.arrowKeys.left.on("up",()=>{
			afterSelect("player-left");
		});
		this.arrowKeys.right.on("down",()=>{
			if(!this.selectorCanMove){
				return;
			}
			this.select(this.gameObject.x+this.travel,this.gameObject.y);
		});
		this.arrowKeys.right.on("up",()=>{
			afterSelect("player-right");
		});
	}

	static getComponent(gameObject: Phaser.GameObjects.Sprite): MoveOnArrowKeys {
		return (gameObject as any)["__MoveOnArrowKeys"];
	}

	private gameObject: Phaser.GameObjects.Sprite;

	public travel:number=0;
	public follower:Phaser.GameObjects.PathFollower|undefined;
	animationKey:string="player-up";
	arrowKeys: Phaser.Types.Input.Keyboard.CursorKeys;
	followerCanMove:boolean=false;
	followerMoving:boolean=false;
	selectorCanMove:boolean=true;
	minX:number=0;
	minY:number=0;
	maxX:number=0;
	maxY:number=0;
	move(){
		this.gameObject.visible=false;
		if(!this.followerCanMove){
			this.resetFollower();
			return;
		}
		this.followerMoving=true;
		this.follower?.path.lineTo(this.gameObject.x,this.gameObject.y);
		this.follower?.play(this.animationKey, true);
		this.follower?.startFollow({
			duration: 300,
			positionOnPath: true,
			repeat: 0,
			ease: 'Linear',
			delay: 40,
			loop:0,
			onComplete:()=>{
				console.log("on complete")
				this.stopFollower();
				if(this.followerMoving){
					this.enableSelect();
					this.followerMoving=false;
				}
			}
		});
	}
	stopFollower(){
		this.follower?.stop();	
		this.follower?.stopFollow();
	}
	resetFollower(){
		const point=this.follower?.path.getStartPoint();
		this.gameObject.setX(point?.x);
		this.gameObject.setY(point?.y);
	}
	collided(){
		this.disableMove();
		this.stopFollower();
		this.resetFollower();
		this.enableSelect();
	}
	select(x:number,y:number){
		if(!this.selectorCanMove){
			return;
		}
		this.disableMove();
		this.gameObject.setY(y);
		this.gameObject.setX(x);
		this.follower?.path.destroy(); //calls follower onComplete()
		this.follower?.setPath(new Phaser.Curves.Path(this.follower?.x, this.follower?.y));
		//need to set bounds collision here before creating a line, because the follower will follower even
		//after stopped in the collision function
		//the physics boundaries was changing the sprite location, possibly due to body origin being different?
		if(!this.withinBounds(x,y)){
			this.collided();
			return;
		}
		this.gameObject.visible=true;
		this.disableSelect();
		this.enableMove();
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
	enableMove(){
		this.followerCanMove=true;
	}
	disableMove(){
		this.followerCanMove=false;
	}
	enableSelect(){
		this.selectorCanMove=true;
	}
	disableSelect(){
		this.selectorCanMove=false;
	}
}
