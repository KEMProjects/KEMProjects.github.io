export default class Button {
    constructor(object:Phaser.GameObjects.Image,
        hover:string,
        active:string
        ){
        object.setInteractive();
        const inactive=object.texture;
        object.on('pointerover', () => { object.setTexture(hover)});
        object.on('pointerout', () => { object.setTexture(inactive.key)});
        object.on('pointerout', () => { 
            object.setTexture(active);
            this.clicked();
        });
    }
    clicked(){
        //override
    }


}