import Button from "./Button";
import NumberSlider from "./NumberSlider";

export class AnswerInput extends Phaser.GameObjects.Container {

	constructor(scene: Phaser.Scene, x?: number, y?: number) {
		super(scene, x ?? 0, y ?? 0);

        const numTenths=this.createNumberInput(x ?? 0, y ?? 0);
        const numOnes=this.createNumberInput(numTenths.back.x+numTenths.back.width+20, y ?? 0);
        const submit=this.scene.add.image(numOnes.back.x+numOnes.back.width+20, y ?? 0,"shadedDark46");
        this.add(submit);
        const submitBtn=new Button(submit,"flatDark45");
        submitBtn.setOnClick(()=>{
            let total=10*numTenths.getNumber();
            total+=numOnes.getNumber();
        });
    }
    createNumberInput(x:number,y:number){
        //create number slider
        console.log(x);
        console.log(y);
        const back = this.scene.add.image(x,y,"grey_panel");
        const up = this.scene.add.image(back.x,back.y-back.height,"shadedLight26");
        const down = this.scene.add.image(back.x,back.y+back.height,"shadedLight27");
        const upBtn = new Button(up,"flatLight24");
        const downBtn = new Button(down,"flatLight25");
        const text = this.scene.add.text(x,y,"", { 
            fontFamily: 'Verdana, "Times New Roman", Tahoma, serif', 
            fontSize: '64px', 
            color: '#000' });
            text.setOrigin(0.5,0.5);
        this.add(back);
        this.add(up);
        this.add(down);
        this.add(text);
        return new NumberSlider(back,text,upBtn,downBtn,0,9);
    }
}