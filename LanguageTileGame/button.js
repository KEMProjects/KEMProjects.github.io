
var Game = {
        preload: function() {
			game.load.atlas('button','assets/spritesheet.png','assets/sprites.json');
			//game.load.atlas('button', 'assets/buttons/button_texture_atlas.png', 'assets/buttons/button_texture_atlas.json');
        },
        create: function() {
			game.stage.backgroundColor = '#0F4F63';
			//generates tile objects

			game.add.button(100,100, 'button',this.action,this,'a','b','b','b');
		//button = game.add.button(game.world.centerX - 95, 400, 'button', actionOnClick, this, 'over', 'out', 'down');
        },
		action: function(){
		}
	};