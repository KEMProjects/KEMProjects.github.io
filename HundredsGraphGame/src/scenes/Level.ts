
import GameBoard from "./GameBoard";


export default class Level extends Phaser.Scene {

	constructor() {
		super("Level");
	}

	create() {

		const gameBoard = new GameBoard(this, 530, 284);
		this.add.existing(gameBoard);

		this.events.emit("scene-awake");
	}

}