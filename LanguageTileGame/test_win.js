var Win={
	preload: function(){
		game.load.image('win','assets/win.png');
		game.load.spritesheet('replay_button','assets/playagain_button.png',270,65);
		game.load.spritesheet('menu_button','assets/menu_button.png',162,65);
	},
	create: function(){
		game.stage.backgroundColor = '#4800FF';
		this.add.sprite(10,25,'win');
		game.add.text(16,16,'Tries: '+tries,{font: '32px Courier New', fill: '#fff'});
		game.add.button(152, 250, 'replay_button',this.startGame,this,1,0,2,2);
		game.add.button(206, 350, 'menu_button',this.back,this,1,0,2,2);
	},
	startGame: function(){
		this.state.start('Game');
	},
	back: function(){
		this.state.start('Menu');
	}
};