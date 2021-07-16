var game;
window.onload = function() {		//add window.onload to run offline

        //var game = new Phaser.Game(600, 500, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });
		game = new Phaser.Game(575, 450, Phaser.AUTO, 'game');
		
		game.state.add('Menu', Menu);
		game.state.add('Game',Game);
		game.state.add('Win', Win);
		game.state.start('Menu');
}