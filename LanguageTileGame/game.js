function Tile(name,sound){
	this.name=name;			//name is used for files, ex: tile1 is name, file would be tile1.jpg
	this.sound=sound;
}
Tile.prototype={
	setMatch: function(match){
		this.match=match;	//name of matching object
	},
	setLocation: function(loc){
		this.loc=loc;
	}	
};
var tileButtons;
var tiles;			//array of tile objects
var totalTiles=6;
var totalMatches=totalTiles*2;
var score;
var scoreText;
var matchTile;			//holds the tile to check against when testing 2nd tile
var match_made;	//reports whether those two tiles match
var tile1;
var tile2;
var updateDelay;
var Game = {
        preload: function() {

			//game.load.image('bg','assets/bg.png');
			game.load.atlas('game_tiles','assets/'+gameType+'/spritesheet.png','assets/'+gameType+'/sprites.json');
			game.load.image('shadow', 'assets/shadow_tile.png');
			for(var i=1; i<=vocabNum; i++){//for(var i=1; i<=totalTiles; i++){
				//game.load.spritesheet('tile'+i,'assets/tile'+i+'.png',100,100);
				game.load.audio('tile'+i+'_ch','assets/'+gameType+'/tile'+i+'_ch.mp3');
				game.load.audio('tile'+i+'_ch_2','assets/'+gameType+'/tile'+i+'_ch_2.mp3');
			}
        },
        create: function() {
			tileButtons=[];
			tiles=[];			//array of tile objects
			score=0;
			scoreText='';
			matchTile=null;			//holds the tile to check against when testing 2nd tile
			match_made=false;	//reports whether those two tiles match
			tile1=null;
			tile2=null;
			updateDelay=0;
		
			//  A simple background for our game
			//game.add.sprite(0, 0, 'bg');
			game.stage.backgroundColor = '#C0ED50';
			//generates tile objects
			var loc=[];
			var tileNum=[];
			for(var i=0;i<totalMatches;i++){
				loc[i]=i;
			}
			for(var i=0;i<vocabNum;i++){
				tileNum[i]=i+1;
			}
			for(var i=0; i<totalTiles;i++){
				var done=false;
				var tile1;
				var tile2;
				var tileIndex;
				var rand = Math.floor(Math.random() * (loc.length-1));
				tile1=loc[rand];
				loc.splice(rand,1);
				rand = Math.floor(Math.random() * (loc.length-1));
				tile2=loc[rand];
				loc.splice(rand,1);
				rand = Math.floor(Math.random() * (tileNum.length-1));
				tileIndex=tileNum[rand];
				tileNum.splice(rand,1);
				
				tiles[tile1] = new Tile('tile'+(tileIndex),game.add.audio('tile'+(tileIndex)+'_ch'));				//create matching tiles
				tiles[tile2] =  new Tile('tile'+(tileIndex),game.add.audio('tile'+(tileIndex)+'_ch_2'));
				tiles[tile1].setLocation(tile1);
				tiles[tile2].setLocation(tile2);
				tiles[tile1].setMatch(tiles[tile2]);			//set their 'match' value to each other
				tiles[tile2].setMatch(tiles[tile1]);
			}
		
			var tileSize=100;
			var space=25;
			var left=50;
			var top=50;
			var tilesPerRow=4;
			var numRows=3;
			for(var k=0;k<numRows;k++){
				for(var i=0;i<tilesPerRow;i++){
					game.add.sprite(i*(tileSize+space)+left+3, top+k*(tileSize+space)+2, 'shadow');
					tileButtons[i+tilesPerRow*k]  = game.add.button(i*(tileSize+space)+left, top+k*(tileSize+space), /*tiles[i+tilesPerRow*k].name*/'game_tiles',this.action,tiles[i+tilesPerRow*k],'a','a','a',tiles[i+tilesPerRow*k].name);
					//tileButtons[i+tilesPerRow*k].anchor.setTo(0.5, 0.5);
				}
			}
			
			game.add.text(50,16,'Click on two tiles and try to find a match!',{font: '16px Courier New', fill: '#000'});
        },
		update:function(){
			//updateDelay++;
			//if (updateDelay % 100== 0){
				if(match_made==true){
					/*tile1.destroy()
					tile2.destroy();*/
					score+=10;
					//scoreText.text='Score: '+score;
					match_made=false;
				}
				/*else if(tile1&&tile2){
					tile1.setFrames(0,0,0);
					tile2.setFrames(0,0,0);
					tile1=null;
					tile2=null;
				}*/
				if(score>=10*totalTiles){
					//scoreText.text='You\'re a winner!';
					this.state.start('Win');
				}
			//}
		},
		action: function(){
			var tileName=tiles[this.loc].name;
			tileButtons[this.loc].setFrames(tileName,tileName,tileName);
			this.sound.play();
			if(!matchTile){
				matchTile=this;
			}
			else{
				if(matchTile.name==this.name){
					tile1=tileButtons[this.loc];
					tile2=tileButtons[matchTile.loc];
					match_made=true;
					matchTile=null;
					window.setTimeout(function(){
						/*tile1.destroy()
						tile2.destroy();*/
						tile1.setFrames('b','b','b');
						tile2.setFrames('b','b','b');
					}, 1000);
				}
				else{
					tile1=tileButtons[this.loc];
					tile2=tileButtons[matchTile.loc];
					matchTile=null;
					window.setTimeout(function(){	
							tile1.setFrames('a','a','a');
							tile2.setFrames('a','a','a');
							matchTile=null;
							tile1=null;
							tile2=null;
						}, 1000);
				}
			}
		
		}
	};