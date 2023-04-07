import Button from "./Button";
import NumberSlider from "./NumberSlider";

export class AnswerInput extends Phaser.GameObjects.Container {
    onSubmit:(answer:number)=>void=()=>{};
	constructor(scene: Phaser.Scene, x?: number, y?: number) {
		super(scene, x ?? 0, y ?? 0);

        const numTenths=this.createNumberInput(x ?? 0, y ?? 0);
        const numOnes=this.createNumberInput(numTenths.back.x+numTenths.back.width+20, y ?? 0);
        const submit=this.scene.add.image(numOnes.back.x+numOnes.back.width+20, y ?? 0,"shadedDark46");
        this.add(submit);
        const submitBtn=new Button(submit,"flatDark45");
        const submitTotal=()=>{
            let total=10*numTenths.getNumber();
            total+=numOnes.getNumber();
            this.onSubmit(total);
        };
        submitBtn.setOnClick(()=>{submitTotal()});
        const keyInDigits=(value:number)=>{
            //if the ones digit is set or tens digit not set, then user is typing new number
            if(numOnes.getNumber()!=0||numTenths.getNumber()==0){
                numTenths.setNumber(value);
                numOnes.setNumber(0);
            }
            else{
                numOnes.setNumber(value);
            }
        };
        for(let i=0;i<10;i++){
            const key=scene.input.keyboard.addKey(48+i);
            key.on('up',()=>{
                if(this.visible){
                    keyInDigits(i);
                }
            });
        }
        const enter=scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        enter.on('up',()=>{
            if(this.visible){
                submitTotal();
            }
        });
        this.setVisible(false);
    }
    createNumberInput(x:number,y:number){
        //create number slider
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