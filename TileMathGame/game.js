"use strict";
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
// You can write more code here
/* START OF COMPILED CODE */
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */
class MoveOnArrowKeys {
    constructor(gameObject) {
        this.gameObject = gameObject;
        gameObject["__MoveOnArrowKeys"] = this;
        /* START-USER-CTR-CODE */
        this.arrowKeys = gameObject.scene.input.keyboard.createCursorKeys();
        const speed = 200;
        this.arrowKeys.down.on("down", () => { this.select(this.gameObject.x, this.gameObject.y + this.travel); });
        this.arrowKeys.up.on("down", () => { this.select(this.gameObject.x, this.gameObject.y - this.travel); });
        this.arrowKeys.left.on("down", () => { this.select(this.gameObject.x - this.travel, this.gameObject.y); });
        this.arrowKeys.right.on("down", () => { this.select(this.gameObject.x + this.travel, this.gameObject.y); });
        this.arrowKeys.down.on("up", () => { this.move('player-down'); });
        this.arrowKeys.up.on("up", () => { this.move('player-up'); });
        this.arrowKeys.left.on("up", () => { this.move('player-left'); });
        this.arrowKeys.right.on("up", () => { this.move('player-right'); });
        /* END-USER-CTR-CODE */
    }
    static getComponent(gameObject) {
        return gameObject["__MoveOnArrowKeys"];
    }
    gameObject;
    /* START-USER-CODE */
    travel = 0;
    follower;
    arrowKeys;
    move(animationKey) {
        console.log("key up");
        this.gameObject.visible = false;
        this.follower?.play(animationKey, true);
        this.follower?.startFollow({
            duration: 300,
            positionOnPath: true,
            repeat: 0,
            ease: 'Linear',
            delay: 40,
            loop: 0,
            onComplete: () => {
                console.log("on complete");
                this.stopFollower();
            }
        });
    }
    stopFollower() {
        this.follower?.stop();
        this.follower?.stopFollow();
    }
    collided() {
        this.stopFollower();
        const point = this.follower?.path.getStartPoint();
        this.gameObject.setX(point?.x);
        this.gameObject.setY(point?.y);
        this.follower?.setX(point?.x);
        this.follower?.setY(point?.y);
    }
    select(x, y) {
        console.log("select");
        this.gameObject.setY(y);
        this.gameObject.setX(x);
        this.follower?.path.destroy();
        this.follower?.setPath(new Phaser.Curves.Path(this.follower?.x, this.follower?.y));
        this.follower?.path.lineTo(x, y);
        this.gameObject.visible = true;
    }
    idle() {
        console.log("idle");
    }
}
/* END OF COMPILED CODE */
// You can write more code here
class UserComponent {
    /**
     * @param gameObject The entity.
     */
    constructor(gameObject) {
        this.scene = gameObject.scene;
        const listenAwake = this.awake !== UserComponent.prototype.awake;
        const listenStart = this.start !== UserComponent.prototype.start;
        const listenUpdate = this.update !== UserComponent.prototype.update;
        const listenDestroy = this.destroy !== UserComponent.prototype.destroy;
        if (listenAwake) {
            this.scene.events.once("scene-awake", this.awake, this);
        }
        if (listenStart) {
            this.scene.events.once(Phaser.Scenes.Events.UPDATE, this.start, this);
        }
        if (listenUpdate) {
            this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
        }
        if (listenStart || listenUpdate || listenDestroy) {
            gameObject.on(Phaser.GameObjects.Events.DESTROY, () => {
                this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.start, this);
                this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
                if (listenDestroy) {
                    this.destroy();
                }
            });
        }
    }
    scene;
    awake() {
        // override this
    }
    start() {
        // override this
    }
    update() {
        // override this
    }
    destroy() {
        // override this
    }
}
/// <reference path="./UserComponent.ts"/>
/* START OF COMPILED CODE */
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */
class PreloadText extends UserComponent {
    constructor(gameObject) {
        super(gameObject);
        this.gameObject = gameObject;
        gameObject["__PreloadText"] = this;
        /* START-USER-CTR-CODE */
        this.scene.load.on(Phaser.Loader.Events.PROGRESS, (p) => {
            this.gameObject.text = Math.floor(p * 100) + "%";
        });
        /* END-USER-CTR-CODE */
    }
    static getComponent(gameObject) {
        return gameObject["__PreloadText"];
    }
    gameObject;
}
/* END OF COMPILED CODE */
// You can write more code here
/// <reference path="./UserComponent.ts"/>
// You can write more code here
/* START OF COMPILED CODE */
/* START-USER-IMPORTS */
/* END-USER-IMPORTS */
class PushOnClick extends UserComponent {
    constructor(gameObject) {
        super(gameObject);
        this.gameObject = gameObject;
        gameObject["__PushOnClick"] = this;
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
    static getComponent(gameObject) {
        return gameObject["__PushOnClick"];
    }
    gameObject;
    /* START-USER-CODE */
    awake() {
        this.gameObject.setInteractive().on("pointerdown", () => {
            this.scene.add.tween({
                targets: this.gameObject,
                scaleX: 0.8,
                scaleY: 0.8,
                duration: 80,
                yoyo: true
            });
        });
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class GameBoard extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x ?? 0, y ?? 0);
        // rectangle_1
        const rectangle_1 = scene.add.rectangle(328, 334, 128, 128);
        rectangle_1.scaleX = 4.581297102599591;
        rectangle_1.scaleY = 4.4033804288654705;
        rectangle_1.isStroked = true;
        this.add(rectangle_1);
        // image_1
        const image_1 = scene.add.image(191, 155, "sokoban_spritesheet", "environment_06.png");
        this.add(image_1);
        /* START-USER-CTR-CODE */
        //replace w/ json
        const numX = 10;
        const numY = 10;
        const tileSize = 64;
        const numBoxes = 10;
        //create gameboard
        const width = numX * tileSize;
        const height = numY * tileSize;
        const tiles = this.createTiles(width, height, tileSize);
        this.createGrid(width, height, tileSize);
        const randEndTile = Math.floor(Math.random() * tiles.length);
        this.createEnd(tiles[randEndTile].x, tiles[randEndTile].y);
        let randStartTile = Math.floor(Math.random() * tiles.length);
        while (randStartTile == randEndTile) {
            randStartTile = Math.floor(Math.random() * tiles.length);
        }
        const cursor = this.createStart(tiles[randStartTile].x, tiles[randStartTile].y);
        const boxes = this.createBlockList(numBoxes, tiles);
        const cursorController = new MoveOnArrowKeys(cursor);
        const playerPath = new Phaser.Curves.Path(cursor.x, cursor.y);
        const player = scene.add.follower(playerPath, cursor.x, cursor.y, "sokoban_spritesheet", "player_01.png");
        this.add(player);
        scene.physics.add.existing(player);
        cursorController.follower = player;
        cursorController.travel = tileSize;
        scene.physics.add.collider(player, boxes, () => {
            console.log("collide");
            cursorController.stopFollower();
        });
        const left = this.minX + this.x;
        const top = this.minY + this.y;
        scene.physics.world.setBounds(left, top, width, height);
        /* END-USER-CTR-CODE */
    }
    /* START-USER-CODE */
    minX = 0;
    minY = 0;
    createStart(x, y) {
        // start
        const start = this.scene.add.image(x, y, "sokoban_spritesheet", "ground_04.png");
        this.add(start);
        // player
        this.scene.physics.add.existing;
        const cursor = this.scene.physics.add.sprite(x, y, "sokoban_spritesheet", "environment_06.png");
        cursor.body.allowGravity = false;
        cursor.body.allowDrag = false;
        cursor.body.allowRotation = false;
        cursor.body.collideWorldBounds = true;
        cursor.body.setSize(cursor.width, cursor.height, false);
        cursor.visible = false;
        this.add(cursor);
        return cursor;
    }
    createBlockList(numBoxes, tiles) {
        let blockList = [];
        for (let i = 0; i < numBoxes; i++) {
            let randTile = Math.floor(Math.random() * tiles.length);
            let box = this.scene.physics.add.image(tiles[randTile].x, tiles[randTile].y, "sokoban_spritesheet", "crate_02.png");
            box.body.moves = false;
            box.body.allowGravity = false;
            box.body.allowDrag = false;
            box.body.allowRotation = false;
            box.body.pushable = false;
            box.body.immovable = true;
            box.body.setSize(64, 64, false);
            this.add(box);
            blockList.push(box);
        }
        return blockList;
    }
    createTiles(width, height, tileSize) {
        const tiles = [];
        for (let i = this.minX + tileSize / 2; i < width; i += tileSize) {
            for (let j = this.minY + tileSize / 2; j < height; j += tileSize) {
                const tile = this.scene.add.image(i, j, "sokoban_spritesheet", "ground_06.png");
                this.add(tile);
                tiles.push(tile);
            }
        }
        return tiles;
    }
    createGrid(width, height, tileSize) {
        let graphics = this.scene.add.graphics();
        this.add(graphics);
        graphics.lineStyle(1, 0xffffff, 1);
        for (let i = this.minX; i <= width; i += tileSize) {
            let path = new Phaser.Curves.Path(i, this.minY);
            path.lineTo(i, height);
            path.draw(graphics);
        }
        for (let j = this.minY; j <= height; j += tileSize) {
            let path = new Phaser.Curves.Path(this.minX, j);
            path.lineTo(width, j);
            path.draw(graphics);
        }
    }
    createEnd(x, y) {
        // end
        const end = this.scene.add.image(x, y, "sokoban_spritesheet", "ground_02.png");
        this.add(end);
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class Level extends Phaser.Scene {
    constructor() {
        super("Level");
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
    editorCreate() {
        // gameBoard
        const gameBoard = new GameBoard(this, 530, 284);
        this.add.existing(gameBoard);
        this.events.emit("scene-awake");
    }
    /* START-USER-CODE */
    // Write your code here.
    create() {
        this.editorCreate();
    }
}
/* END OF COMPILED CODE */
// You can write more code here
// You can write more code here
/* START OF COMPILED CODE */
class Preload extends Phaser.Scene {
    constructor() {
        super("Preload");
        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }
    editorPreload() {
        this.load.pack("asset-pack", "assets/asset-pack.json");
    }
    editorCreate() {
        // guapen
        const guapen = this.add.image(400, 219, "guapen");
        guapen.scaleX = 0.5915891440784282;
        guapen.scaleY = 0.5915891440784282;
        // progress
        const progress = this.add.text(400, 349, "", {});
        progress.setOrigin(0.5, 0.5);
        progress.text = "0%";
        progress.setStyle({ "fontSize": "30px" });
        // progress (components)
        new PreloadText(progress);
        this.events.emit("scene-awake");
    }
    /* START-USER-CODE */
    // Write your code here
    preload() {
        this.editorCreate();
        this.editorPreload();
        this.load.on(Phaser.Loader.Events.COMPLETE, () => this.scene.start("Level"));
    }
}
/* END OF COMPILED CODE */
// You can write more code here
