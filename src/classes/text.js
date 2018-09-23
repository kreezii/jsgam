import {game} from '../game.js';

var textStyle = new PIXI.TextStyle({
  align: "center",
  dropShadow: true,
  dropShadowAlpha: 0.5,
  dropShadowBlur: 5,
  dropShadowDistance: 2,
  fill: "white",
  fontFamily: "\"Palatino Linotype\", \"Book Antiqua\", Palatino, serif",
  fontSize: 25,
  fontWeight: "bold"
  //wordWrapWidth: game.width
});

var buttonTextStyle= new PIXI.TextStyle({
    dropShadowAngle: 0.5,
    dropShadowBlur: 3,
    dropShadowDistance: 0,
    fill: "white",
    fontSize: 32,
    fontVariant: "small-caps",
    fontWeight: "bold",
    lineJoin: "round",
    align: 'center',
    strokeThickness: 8
});

export class TextField{
  constructor(){
    this.container=new PIXI.Container();
    this.dialogueOptions=new PIXI.Container();

    this.Background=new PIXI.Sprite(PIXI.Texture.WHITE);
    this.Background.width=game.width;
    this.Background.height=game.height/4;
    this.Background.tint='black';
    this.Background.alpha=0.5;

    this.Field=new PIXI.Text("", textStyle);
    this.Field.anchor.set(0.5,0);
    this.Field.x=game.width/2;
    this.Field.y=0;

    this.container.addChild(this.Background);
    this.container.addChild(this.Field);
    this.container.visible=false;
    this.container.parentLayer = game.layerUI;
    }

    hide(){
      this.container.visible=false;
    }

    show(){
      this.Background.height=this.Field.height;
      this.container.visible=true;
    }
}

export class TextButton extends PIXI.Text{
    constructor(text,posV){
      super(text,buttonTextStyle);
      this.interactive=true;
      this.buttonMode=true;
      this.anchor.set(0.5);
      this.x=this.width/2;
      this.y=posV*this.height*1.5;
    }
}

class DialogueOption extends PIXI.Text{
    constructor(text,posV){
      super(text,textStyle);
      this.interactive=true;
      this.buttonMode=true;
      this.anchor.set(0.5);
      this.x=this.width/2;
      this.y=posV*this.height*1.5;
    }
}
