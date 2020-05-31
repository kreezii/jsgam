import {Sprite} from 'pixi.js';

class IconButton extends Sprite{
  constructor(image){
    super(image);
    this.interactive=true;
    this.buttonMode=true;
  }
}

class Options{
  constructor(){
    this.container=new PIXI.Container();
    this.container.visible=false;
    this.game=null;
  }

  build(){
    if(this.game.settings.Options.Sound){
      this.iconSound=new IconButton(PIXI.Texture.from(this.game.settings.Options.Sound.Icon));
      this.iconSound.on('pointertap',this.sound.bind(this));
      this.setIcon(this.iconSound,this.game.settings.Options.Sound.Position);
      this.container.addChild(this.iconSound);
      this.iconSound.parentLayer = this.game.layerUI;
    }

    if(this.game.settings.Options.Fullscreen){
      this.iconScreen=new IconButton(PIXI.Texture.from(this.game.settings.Options.Fullscreen.Icon));
      this.iconScreen.on('pointertap',this.fullscreen.bind(this));
      this.setIcon(this.iconScreen,this.game.settings.Options.Fullscreen.Position);
      this.container.addChild(this.iconScreen);
      this.iconScreen.parentLayer = this.game.layerUI;
    }
  }

  hide(){
    this.container.visible=false;
  }

  show(){
    this.container.visible=true;
  }

  fullscreen(){
    this.game.fullscreen();
  }

  sound(){
    if(this.game.playSounds){
      if(this.game.activeScene.music!==undefined){
        this.game.music[this.game.activeScene.music].stop();
      }
      this.game.playSounds=false;
    }else{
      this.game.playSounds=true;
      if(this.game.activeScene.music!==undefined){
        this.game.music[this.game.activeScene.music].play(true);
      }
    }
  }

  setIcon(icon,position){
    if(position=="bottom-right"){
      icon.x=this.game.width - icon.width;
      icon.y=this.game.height - icon.height;
    }else if(position=="top-right"){
      icon.x=this.game.width - icon.width;
    icon.y=0;
    }else if(position=="bottom-left"){
      icon.x=0;
      icon.y=this.game.height - icon.height;
    }else if(position=="top-left"){
      icon.x=this.game.width - icon.width;
      icon.y=0;
    }else if(position=="top-left"){
      icon.x=this.game.width - icon.width;
      icon.y=0;
    }
  }

}
export default Options;
