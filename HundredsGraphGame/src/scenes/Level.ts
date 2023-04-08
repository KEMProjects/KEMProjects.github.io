
import { AnswerInput } from "../classes/AnswerInput";
import { ArrowKeyMovement } from "../classes/ArrowKeyMovement";
import BoardView from "./BoardView";
export default class Level extends Phaser.Scene {

	constructor() {
		super("Level");
	}

	create() {
		const boardX=530;
		const boardY=184;
		//replace w/ json
		const numX=10;
		const numY=10;
		const tileSize=64;
		const width=numX*tileSize;
		const height=numY*tileSize;
		const gameBoard = new BoardView(this, boardX, boardY);
		this.add.existing(gameBoard);	
		const arrowKeys = new ArrowKeyMovement(this,150,200);
		this.add.existing(arrowKeys);
		const gameAnswer = new AnswerInput(this,350,boardY+height/2);
		gameBoard.onMove=(expected:number,atEnd:boolean)=>{
			gameAnswer.onSubmit=(answer:number)=>{
				if(answer==expected){
					gameBoard.finishMove();
					gameAnswer.setVisible(false);
					if(atEnd){
						this.scene.start("Complete");
					}
				}
				else{
					console.log("wrong answer");
				}
			};
			gameAnswer.setVisible(true);
		};

		this.add.existing(gameAnswer);
		
		this.events.emit("scene-awake");
	}

}