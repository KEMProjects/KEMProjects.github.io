import Phaser from 'phaser';
import Preload from './scenes/Preload';
import Level from './scenes/Level';
import Complete from './scenes/Complete';
var config = {
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#9ECBE5',
    scale: {
      width: 1440,
      height: 900,
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 }, // 👈 change to 0
      }
    },
    scene: [ Preload, Level, Complete ]
  };
  
var game = new Phaser.Game( config);
