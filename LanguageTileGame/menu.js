var gameType;
var vocabNum;
var Menu={
	preload: function(){
		//game.load.image('menu','assets/menu.png');
		game.load.spritesheet('colors_button','assets/color_button.png',200,65);
		game.load.spritesheet('numbers_button','assets/numbers_button.png',200,65);
		game.load.spritesheet('animals_button','assets/animals_button.png',200,65);
		game.load.image('shadow', 'assets/shadow.png');
	},
	create: function(){
		//this.add.button(0,0,'menu',this.startGame,this);
		game.stage.backgroundColor = 'F2F2F2';//'#0F4F63';
		game.add.text(150,16,'Word Memory',{font: '42px Verdana', fill: '#000'});
		game.add.sprite(53, 102, 'shadow');
		game.add.button(50, 100, 'colors_button',this.startColors,this,1,0,2,2);
		game.add.sprite(53, 202, 'shadow');
		game.add.button(50, 200, 'numbers_button',this.startNumbers,this,1,0,2,2);
		game.add.sprite(53, 302, 'shadow');
		game.add.button(50, 300, 'animals_button',this.startAnimals,this,1,0,2,2);
	},
	startColors: function(){
		gameType='colors';
		vocabNum=6;
		this.state.start('Game');
	},
	startNumbers: function(){
		gameType='numbers';
		vocabNum=6;
		this.state.start('Game');
	},
	startAnimals: function(){
		gameType='animals';
		vocabNum=10;
		this.state.start('Game');
	}
};