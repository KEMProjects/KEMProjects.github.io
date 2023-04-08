import Button from "./Button";

export class ArrowKeyMovement extends Phaser.GameObjects.Container {
	constructor(scene: Phaser.Scene, x?: number, y?: number) {
        super(scene, x ?? 0, y ?? 0);
        const pad=50;
        x=x??0;
        y=y??0;
        const up = this.scene.add.image(x,y-pad,"moveUpBtnDefault");
        const down = this.scene.add.image(x,y+pad,"moveDownBtnDefault");
        const left = this.scene.add.image(x-pad,y,"moveLeftBtnDefault");
        const right = this.scene.add.image(x+pad,y,"moveRightBtnDefault");
        const upBtn = new Button(up,"moveUpBtnHover");
        const downBtn = new Button(down,"moveDownBtnHover");
        const leftBtn = new Button(left,"moveLeftBtnHover");
        const rightBtn = new Button(right,"moveRightBtnHover");
        this.add(up);
        this.add(down);
        this.add(left);
        this.add(right);
    }
}