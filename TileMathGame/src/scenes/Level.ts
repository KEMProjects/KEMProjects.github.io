
// You can write more code here

import GameBoard from "./GameBoard";

/* START OF COMPILED CODE */

export default class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// gameBoard
		const gameBoard = new GameBoard(this, 530, 284);
		this.add.existing(gameBoard);

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here.

	create() {

		this.editorCreate();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
