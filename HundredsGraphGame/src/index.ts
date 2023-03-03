import Phaser from 'phaser';
import config from './config';
import GameScene from './scenes/Game';
import Level from './scenes/Level';

const game = new Phaser.Game(
  Object.assign(config, {
    scene: [GameScene]
  })
);
game.scene.add("Level", Level);
