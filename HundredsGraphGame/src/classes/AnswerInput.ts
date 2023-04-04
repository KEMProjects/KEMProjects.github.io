import Button from "./Button";
import NumberSlider from "./NumberSlider";

export class AnswerInput extends Phaser.GameObjects.Container {

	constructor(scene: Phaser.Scene, x?: number, y?: number) {
		super(scene, x ?? 0, y ?? 0);

        const numTenths=this.createNumberInput(x ?? 0, y ?? 0);
        //const numOnes=this.createNumberInput((x ?? 0)+100, y ?? 0);
    }
    createNumberInput(x:number,y:number){
        //create number slider
        console.log(x);
        console.log(y);
        const back = this.scene.add.image(x,y,"grey_panel");
        const up = this.scene.add.image(back.x,back.y-back.height,"shadedLight26");
        const down = this.scene.add.image(back.x,back.y+back.height,"shadedLight27");
        const upBtn = new Button(up,"shadedLight26","flatLight24");
        const downBtn = new Button(down,"shadedLight27","flatLight25");
        const text = this.scene.add.text(x,y,"test");
        this.add(back);
        this.add(up);
        this.add(down);
        this.add(text);
        return new NumberSlider(back,text,upBtn,downBtn);
    }
}