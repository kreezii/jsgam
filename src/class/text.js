class Button extends PIXI.Text{
    constructor(text,style){
      super(text,style);
      this.interactive=true;
      this.buttonMode=true;
    }
}

class TextField{
  constructor(){
    this.container=new PIXI.Container();
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

    this.Text=new Button("", this.game.settings.Text.Style);
    this.Text.anchor.set(0.5,0);
    this.Text.x=this.game.width/2;
    this.Text.y=0;
    this.Text.on('pointertap',this.skip.bind(this));

    this.container.addChild(this.Background);
    this.container.addChild(this.Text);
    if(this.game.settings.Text.Position!==undefined) this.setPosition(this.game.settings.Text.Position);
  }

  show(){
    this.container.visible=true;
  }

  hide(){
    this.container.visible=false;
  }

  skip(){
    this.setText("");
    this.hide();
    this.game.player.stop();
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
    if(this.game.settings.Text.Speed!==undefined) time=this.game.settings.Text.Speed;
    else time=this.countWords(this.Text.text)/3;
    return time*1000;
  }

  setColor(colour){
    this.Text.tint=colour;
  }
}

export {Button,TextField};
