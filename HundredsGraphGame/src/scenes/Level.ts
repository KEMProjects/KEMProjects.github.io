
import { AnswerInput } from "../classes/AnswerInput";
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

		const gameAnswer = new AnswerInput(this,350,boardY+height/2);
		this.add.existing(gameAnswer);
		
		this.events.emit("scene-awake");
	}

}