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
    this.choicesContainer=new PIXI.Container();
    this.Choices=[];

    this.Background=new PIXI.Sprite(PIXI.Texture.WHITE);
    this.Background.width=game.width;
    this.Background.height=game.height/4;
    this.Background.tint='black';
    this.Background.alpha=0.5;

    this.Field=new PIXI.Text("", textStyle);
    this.Field.anchor.set(0.5,0);
    this.Field.x=game.width/2;
    this.Field.y=0;

    for(let i=0;i<3;i++){
      this.Choices[i]=new TextButton("Option");
      this.Choices[i].style=textStyle;
      this.Choices[i].on('pointertap', onChoiceTap);
      this.Choices[i].index=i;
      this.choicesContainer.addChild(this.Choices[i]);
      if(i>0)this.Choices[i].y=this.Choices[i-1].y+this.Choices[i-1].height;
    }

    this.sortChoices();

    this.container.addChild(this.Background);
    this.container.addChild(this.Field);
    this.container.addChild(this.choicesContainer);
    this.container.visible=false;

    this.choicesContainer.x = game.width / 2;
  //  this.choicesContainer.y = 0;
    this.choicesContainer.pivot.x = this.choicesContainer.width / 2;

    this.choicesContainer.visible=false;

    this.container.parentLayer = game.layerUI;
    }

    hide(){
      this.container.visible=false;
    }

    show(){
      this.Background.height=this.Field.height;
      this.container.visible=true;
      this.Field.visible=true;
      this.choicesContainer.visible=false;
    }

    showChoices(){
      this.Field.visible=false;
      this.choicesContainer.visible=true;
      this.Background.height=this.container.height;
    }

    sortChoices(){
      for(let i=0;i<this.Choices.length;i++){
        this.Choices[i].anchor.set(0.5,0);
        this.Choices[i].x=this.choicesContainer.width/2;
      }
    }

    showText(){
      this.Field.visible=true;
      this.choicesContainer.visible=false;
    }

    changeText(newText){
      this.Field.text=newText;
    }
}

export class TextButton extends PIXI.Text{
    constructor(text){
      super(text,buttonTextStyle);
  //    this.index=index;
      this.interactive=true;
      this.buttonMode=true;
    //  this.anchor.set(0.5);
    }
}

function onChoiceTap(){
  game.DialogueChoice(this.index);
  console.log(this.index)
}
