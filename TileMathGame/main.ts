import Level from "./src/scenes/Level";
import Preload from "./src/scenes/Preload";

window.addEventListener('load', function () {

	var game = new Phaser.Game({
		width: 1600,
		height: 1200,
		type: Phaser.AUTO,
        backgroundColor: "#242424",
		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH
		},
		physics: {
			default: 'arcade',
			arcade: {
				gravity: { y: 0 } // 👈 change to 0
			}
		}

	});

	game.scene.add("Preload", Preload);
	game.scene.add("Level", Level);
    game.scene.add("Boot", Boot, true);
});

class Boot extends Phaser.Scene {

	preload() {
		
		this.load.pack("pack", "assets/preload-asset-pack.json");
	}

	create() {
		
        this.scene.start("Preload");
	}

}