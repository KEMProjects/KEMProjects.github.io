export default class Complete extends Phaser.Scene {

	constructor() {
		super("Complete");
	}

	create() {
		const text = this.add.text(this.game.canvas.width/2,184,"Well done! Want to play again?", { 
            fontFamily: 'Verdana, "Times New Roman", Tahoma, serif', 
            fontSize: '64px', 
            color: '#000' });
            text.setOrigin(0.5,0.5);
		this.events.emit("scene-awake");
	}

}