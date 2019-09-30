import {BitmapText} from 'pixi.js';

class Button extends BitmapText{
    constructor(text,style){
      super(text,style);
      this.interactive=true;
      this.buttonMode=true;
    }
}

class Infotxt extends BitmapText{
    constructor(text,style){
      super(text,style);
    }
}


class Phrases{
  constructor(config){
    this.container=new PIXI.Container();
    this.hide();
    this.game=config;
    this.option=[];

    for(let i=0;i<this.game.dialogueChoices;i++){
      this.option[i]=new Button("Option",this.game.settings.Text.Button);
      this.option[i].game=this.game;
      this.option[i].anchor.set(0.5,0);
      this.option[i].on('pointertap', this.onTap.bind(this.option[i]));
      this.option[i].index=i;
      this.container.addChild(this.option[i]);
      this.option[i].x=this.container.width/2;
      if(i>0)this.option[i].y=this.option[i-1].y+this.option[i-1].height;
    }
  }

  show(){
    this.container.visible=true;
  }

  hide(){
    this.container.visible=false;
  }

  onTap(){
    let activeChoice=this.game.activeDialogue.currentBranch.Choices;

    if(this.alpha==1){
      this.game.activeDialogue.choice=this.index;
      if(activeChoice[this.index].Repeat==false) activeChoice[this.index].disabled=true;
      this.game.activeDialogue.next();
    }
  }

  get(){
    this.clear();
    let options=this.game.activeDialogue.currentBranch.Choices;
    for(let i=0;i<options.length;i++){
      if(options[i].disabled){
        this.option[i].alpha=0.5;
      }else this.option[i].alpha=1;
      this.option[i].visible=true;
      this.option[i].text=options[i].Text[this.game.activeLanguage];
    }
    this.sort();
    this.show();
  }

  clear(){
    for(let i=0;i<this.option.length;i++){
      this.option[i].visible=false;
    }
  }

  sort(){
    for(let i=0;i<this.option.length;i++){
      this.option[i].x=this.container.width/2;
    }
    if(this.container.width>this.container.parent.width || this.container.height>this.container.parent.height){
      this.scale();
    }
    this.center();
  }

  scale(){
    let ratio = Math.min( this.game.width/this.container.width,  this.container.parent.height/this.container.height);
    this.container.scale.set(ratio*0.95)
  }

  center(){
    this.container.x = this.game.width / 2;
  //  this.container.y = this.game.height / 2;
    this.container.pivot.x = this.container.width / 2;
  //  this.container.pivot.y = this.container.height / 2;
  }
}

class TextField{
  constructor(){
    this.container=new PIXI.Container();
    this.Avatar=null;
    this.Background=null;
    this.Text=null;
    this.container.visible=false;
  }

  build(){
    this.container.parentLayer = this.game.layerUI;
    this.Background=new PIXI.Sprite(PIXI.Texture.WHITE);

    let size=4;
    if(this.game.settings.Text.Size!==undefined){
      if(this.game.settings.Text.Size==="fourth") size=4;
      else if(this.game.settings.Text.Size==="half") size=2;
    }
    this.Background.width=this.game.width;
    this.Background.height=this.game.height/size;

    this.Background.tint='black';
    this.Background.alpha=0.5;

    this.Avatar=new PIXI.Sprite(PIXI.Texture.from(this.game.data.player.Avatar));
    let ratio=this.Avatar.width / this.Avatar.height;
    this.Avatar.height=this.Background.height;
    this.Avatar.width=this.Avatar.height*ratio*0.95;

    this.Text=new Button("", this.game.settings.Text.Style);
    this.Text.x=this.Avatar.width*1.05;
  //  this.Text.anchor.set(0.5,0);
    this.Text.maxWidth=this.game.width-this.Avatar.width;

    this.Text.y=0;
    this.Text.on('pointertap',this.skip.bind(this));

    this.Choices=new Phrases(this.game);

    this.container.addChild(this.Background);
    this.container.addChild(this.Avatar);
    this.container.addChild(this.Text);
    this.container.addChild(this.Choices.container);

    //this.Text.x=this.container.width/2;
    this.Choices.sort();
    if(this.game.settings.Text.Position!==undefined) this.setPosition(this.game.settings.Text.Position);
  }

  show(){
    this.Text.visible=true;
    this.container.visible=true;
  }

  hide(){
    this.container.visible=false;
  }

  end(){
    if(this.game.activeDialogue!==null){
      this.talker.shutup();
      if(this.game.activeDialogue.choice!==null) this.game.activeDialogue.answer();
      else{
        this.Text.visible=false;
        this.Avatar.visible=false;
        this.Choices.get();
      }

    }else{
      this.setText("");
      this.hide();
      this.talker.shutup();
      this.game.player.stop();
      if(this.game.activeObject!==null) this.game.activeObject.cancel();
    }
  }

  skip(){
    this.end();
    if(this.talker) clearTimeout(this.talker.timeoutID);
  }

  setPosition(position){
    if(position==="top"){
      this.container.x=0;
      this.container.y=0;
    }else if(position==="bottom"){
      this.container.x=0;
      this.container.y=this.game.height-this.container.height;
    }
  }

  setText(newText){
    this.Text.text=newText;
    if(this.Text.width>this.container.width || this.Text.height>this.container.height){
      this.adjustText();
    }
  }

  adjustText(){
    let ratio = Math.min( this.container.width/this.Text.width,  this.container.height/this.Text.height);
    this.container.scale.set(ratio*0.95);
  }

  //Get words number of the text
  countWords(str) {
   return str.split(" ").length;
  }

  //Calculate how many seconds we show the text
  timeOut(){
    let time;
    if(this.game.activeVoice!==null) time=this.game.voices[this.game.activeVoice].duration();
    else if(this.game.settings.Text.Speed!==undefined) time=this.game.settings.Text.Speed;
    else time=this.countWords(this.Text.text)/3;

    //Time must be at least 1 second
    if(time<1) time=1;

    return time*1000;
  }

  setColor(colour){
    this.Text.tint=colour;
  }

  setFont(newFont){
    this.Text.font=newFont;
  }

  setAvatar(newAvi){
    this.Avatar.visible=true;
    this.Avatar.texture=(PIXI.Texture.from(newAvi));
  }

  hideAvatar(){
    this.Avatar.visible=false;
  }

}

export {Button,TextField,Infotxt};
