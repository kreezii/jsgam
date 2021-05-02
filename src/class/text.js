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
      this.option[i].x=this.game.width/2;
      if(i>0)this.option[i].y=this.option[i-1].y+this.option[i-1].height*1.05;
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
    if(this.game.activeDialogue.currentBranch!==undefined){
      let options=this.game.activeDialogue.currentBranch.Choices;
      let length=options.length;
      if(length>this.game.dialogueChoices) length=this.game.dialogueChoices;
      for(let i=0;i<length;i++){
        if(options[i].disabled){
          this.option[i].alpha=0.5;
        }else this.option[i].alpha=1;
        this.option[i].visible=true;
        let text=options[i].Text[this.game.activeLanguage];
        if(text===undefined) text=options[i].Text[0];
        this.option[i].text="- "+text;
      }
      this.update();
      this.show();
    }else{
      this.game.activeDialogue=null;
      this.game.textField.end();
    }

  }

  clear(){
    for(let i=0;i<this.option.length;i++){
      this.option[i].visible=false;
    }
  }

  update(){
    let branch=this.game.activeDialogue.currentBranch;
    let choices=branch.Choices;

    for(let i=0;i<choices.length;i++){
      if(branch.Size!==undefined) this.option[i].fontSize=branch.Size;
      if(choices[i].Size!==undefined) this.option[i].fontSize=choices[i].Size;
      if(i>0) this.option[i].y=this.option[i-1].y+this.option[i-1].height*1.05;
    }
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
    if(this.Avatar.height>this.Background.height){
      let ratio=this.Avatar.width / this.Avatar.height;
      this.Avatar.height=this.Background.height;
      this.Avatar.width=this.Avatar.height*ratio*0.95;
    }


    this.Text=new Button("", this.game.settings.Text.Style);
    this.Text.x=this.Avatar.width*1.05;
    this.Text.maxWidth=this.game.width-this.Avatar.width;
    this.Text.Color=0xffffff;

    this.Text.y=0;
    this.Text.on('pointertap',this.skip.bind(this));

    this.Choices=new Phrases(this.game);

    this.container.addChild(this.Background);
    this.container.addChild(this.Avatar);
    this.container.addChild(this.Text);
    this.container.addChild(this.Choices.container);

    //this.Text.x=this.container.width/2;
    //this.Choices.update();
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
      if(this.talker!==undefined) this.talker.shutup();
    //  this.game.activeNPC=null;
      if(this.game.activeObject!==null) this.game.activeObject.cancel();
      this.game.player.unlock();
    }
  }

  skip(){
    if(this.talker) clearTimeout(this.talker.timeoutID);
    this.end();
  }

  setPosition(position){
    if(position==="top"){
      this.container.x=0;
      this.container.y=0;
    }else if(position==="bottom"){
      this.container.x=0;
      this.container.y=this.game.height-this.Background.height;
    }
  }

  setText(newText){
    this.Text.text=newText;
    let extraWidth=0;
    if(this.Avatar.visible) extraWidth=this.Avatar.width;
    this.Text.scale.set(.95);
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
    //Change color only if really is necessary
    if(this.Text.Color!=colour){
      this.Text.tint=colour;
      this.Text.Color=colour;
    }
  }

  setFont(newFont){
    this.Text.fontName=newFont;
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
