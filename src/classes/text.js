import {game} from '../game.js';

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

    this.CharacterPic=new PIXI.Sprite(PIXI.Texture.EMPTY);
    this.CharacterPic.visible=false;

    this.Field=new PIXI.Text("", game.settings.TextStyle);
    this.Field.anchor.set(0.5,0);
    this.Field.x=game.width/2;
    this.Field.y=0;

    for(let i=0;i<3;i++){
      this.Choices[i]=new TextButton("Option");
      this.Choices[i].style=game.settings.TextStyle;
      this.Choices[i].on('pointertap', onChoiceTap);
      this.Choices[i].index=i;
      this.choicesContainer.addChild(this.Choices[i]);
      if(i>0)this.Choices[i].y=this.Choices[i-1].y+this.Choices[i-1].height;
    }

    this.sortChoices();

    this.container.addChild(this.Background);
    this.container.addChild(this.Field);
    this.container.addChild(this.CharacterPic);
    this.container.addChild(this.choicesContainer);
    this.container.visible=false;
  //  this.choicesContainer.width = game.width;
  //  this.choicesContainer.x = game.width / 2;

  //  this.choicesContainer.y = 0;
    //this.choicesContainer.pivot.x = this.choicesContainer.width / 2;

    this.choicesContainer.visible=false;

    this.container.parentLayer = game.layerUI;
    }

    hide(){
      this.container.visible=false;
    }

    show(){
      this.Background.height=this.Field.height;
      if(this.CharacterPic.height>this.Field.height && this.CharacterPic.visible) this.Background.height=this.CharacterPic.height;
      this.container.visible=true;
      this.Field.visible=true;
      this.choicesContainer.visible=false;
    }

    showChoices(){
      this.sortChoices();
      this.Field.visible=false;
      this.choicesContainer.visible=true;
      this.Background.height=this.choicesContainer.height;
    }

    sortChoices(){
      for(let i=0;i<this.Choices.length;i++){
        this.Choices[i].anchor.set(0.5,0);
        this.Choices[i].x=game.width/2;
      }
    }

    clearChoices(){
      for(let i=0;i<this.Choices.length;i++){
        this.Choices[i].visible=false;
      }
    }

    showText(){
      this.Field.visible=true;
      this.choicesContainer.visible=false;
    }

    changeText(newText){
      this.Field.text=newText;
    }

    showAvatar(){
      this.CharacterPic.visible=true;
    }

    hideAvatar(){
      this.CharacterPic.visible=false;
    }

}

export class TextButton extends PIXI.Text{
    constructor(text){
      super(text,game.settings.ButtonTextStyle);
      this.interactive=true;
      this.buttonMode=true;
    }
}

function onChoiceTap(){
  if(this.alpha==1) game.dialogueChoice(this.index);
}
