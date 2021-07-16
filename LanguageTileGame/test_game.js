
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
var maxTiles=12;
var totalTiles;
var score;
var scoreText;
var matchTile;			//holds the tile to check against when testing 2nd tile
var match_made;	//reports whether those two tiles match
var tile1;
var tile2;
var updateDelay;
var start;
var playOrder;
var currPlay;
var tries;
var Game={
        preload: function() {
			//game.load.image('bg','assets/bg.png');
			if(vocabNum<maxTiles){
				totalTiles=vocabNum;
			}
			else{
				totalTiles=maxTiles;
			}
			game.load.atlas('game_tiles','assets/'+gameType+'/spritesheet.png','assets/'+gameType+'/sprites.json');
			game.load.image('shadow', 'assets/shadow_tile.png');
			for(var i=1; i<=totalTiles; i++){
				//game.load.spritesheet('tile'+i,'assets/tile'+i+'.png',100,100);
				game.load.audio('tile'+i+'_ch','assets/'+gameType+'/tile'+i+'_ch.mp3');
				game.load.audio('tile'+i+'_ch_2','assets/'+gameType+'/tile'+i+'_ch_2.mp3');
			}
        },

		create:function () {
			tileButtons=[];
			tiles=[];			//array of tile objects
			score=0;
			scoreText='';
			matchTile=null;			//holds the tile to check against when testing 2nd tile
			match_made=false;	//reports whether those two tiles match
			tile1=null;
			tile2=null;
			updateDelay=0;
			start=false;
			playOrder=[];
			currPlay=0;
			tries=0;
			//  A simple background for our game
			game.stage.backgroundColor = '#C0ED50';
			//generates tile objects
			var loc=[];
			for(var i=0;i<totalTiles;i++){
				loc[i]=i;
				tiles[i] = new Tile('tile'+(i+1),game.add.audio('tile'+(i+1)+'_ch'));				//create matching tiles
				tiles[i].setLocation(i);
			}
			
			for(var i=0; i<totalTiles;i++){
				var done=false;
				var rand = Math.floor(Math.random() * loc.length);
				playOrder[i]=loc[rand];
				loc.splice(rand,1);
			}
			//575,450
			
			var tileSize=100;
			var space=25;
			var left;
			var top;
			var tilesPerRow;
			var numRows;
			if(totalTiles<9){	//3x3
				tilesPerRow=3;
			}
			else{
				tilesPerRow=4; //4x3
			}
			left=(575-((tileSize+space)*tilesPerRow)+space)/2;
			numRows=Math.ceil(totalTiles/tilesPerRow);			//6 tiles-> 2 rows, 9 tiles->3 rows;
			top=(450-((tileSize+space)*numRows)+space)/2;
			
			for(var k=0;k<numRows;k++){
				for(var i=0;i<tilesPerRow;i++){
					if(tiles[i+tilesPerRow*k]){
						game.add.sprite(i*(tileSize+space)+left+3, top+k*(tileSize+space)+2, 'shadow');
						tileButtons[i+tilesPerRow*k]  = game.add.button(i*(tileSize+space)+left, top+k*(tileSize+space), /*tiles[i+tilesPerRow*k].name*/'game_tiles',this.action,tiles[i+tilesPerRow*k],tiles[i+tilesPerRow*k].name,tiles[i+tilesPerRow*k].name,tiles[i+tilesPerRow*k].name,tiles[i+tilesPerRow*k].name);
						//tileButtons[i+tilesPerRow*k].anchor.setTo(0.5, 0.5);
					}
				}
			}
			game.add.text(50,16,'Listen to the word, click on the matching picture!',{font: '16px Courier New', fill: '#000'});
			
        },
		update:function(){
			updateDelay++;
			if (updateDelay % 30== 0){
				if(!start){
					start=true;
					tiles[playOrder[currPlay]].sound.play();
				}
				if(match_made==true){
					currPlay++;
					tile1.setFrames('b','b','b');
					score+=10;
					match_made=false;
					if(currPlay<tiles.length)
						tiles[playOrder[currPlay]].sound.play();
				}
				if(score>=10*totalTiles){
					this.state.start('Win');
				}
			}
		},
		action:function(){
			if(this==tiles[playOrder[currPlay]]){
				tile1=tileButtons[this.loc];
				match_made=true;
			}
			else{
				start=false;
				tries++;
			}
			
		
		}
    };