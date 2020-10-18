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
    let numIcons=0;

    if(this.game.settings.Options.Icon){
      this.icon=new IconButton(PIXI.Texture.from(this.game.settings.Options.Icon));
      this.icon.on('pointertap',this.click.bind(this));
      this.setIcon(this.icon,this.game.settings.Options.Position);
      this.icon.parentLayer = this.game.layerUI;
    }

    if(this.game.settings.Options.Home){
      this.iconHome=new IconButton(PIXI.Texture.from(this.game.settings.Options.Home));
      this.iconHome.on('pointertap',this.game.home);
      numIcons++;
      this.setPos(this.iconHome,numIcons);
      this.container.addChild(this.iconHome);
      this.iconHome.parentLayer = this.game.layerUI;
    }

    if(this.game.settings.Options.Sound){
      this.iconSound=new IconButton(PIXI.Texture.from(this.game.settings.Options.Sound));
      this.iconSound.on('pointertap',this.sound.bind(this));
      numIcons++;
      this.setPos(this.iconSound,numIcons);
      this.container.addChild(this.iconSound);
      this.iconSound.parentLayer = this.game.layerUI;
    }

    if(this.game.settings.Options.Fullscreen){
      this.iconScreen=new IconButton(PIXI.Texture.from(this.game.settings.Options.Fullscreen));
      this.iconScreen.on('pointertap',this.fullscreen.bind(this));
      numIcons++;
      this.setPos(this.iconScreen,numIcons);
      this.container.addChild(this.iconScreen);
      this.iconScreen.parentLayer = this.game.layerUI;
    }
  }

  click(){
    if (this.container.visible) this.hide();
    else this.show();
  }

  hideIcon(){
    this.icon.visible=false;
  }

  showIcon(){
    this.icon.visible=true;
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
      if(this.game.settings.Options.Mute) this.iconSound.texture=PIXI.Texture.from(this.game.settings.Options.Mute);
      this.game.playSounds=false;
    }else{
      this.game.playSounds=true;
      if(this.game.activeScene.music!==undefined){
        this.game.music[this.game.activeScene.music].play();
      }
      if(this.game.settings.Options.Sound && this.game.settings.Options.Mute) this.iconSound.texture=PIXI.Texture.from(this.game.settings.Options.Sound);
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
      this.icon.x=0;
      this.icon.y=0;
    }
  }

  setPos(iconOpt,numIcons){
    let iconPos=this.game.settings.Options.Position;
    if(iconPos.includes('top')){
      iconOpt.y=this.icon.height*numIcons;
    }else if(iconPos.includes('bottom')){
      iconOpt.anchor.set(0,1);
      iconOpt.y=this.game.height-this.icon.height*numIcons;
    }

    if(iconPos.includes('left')){
      iconOpt.x=0;
    }else if(iconPos.includes('right')){
      iconOpt.x=this.game.width-iconOpt.width;
    }
  }

}
export default Options;
