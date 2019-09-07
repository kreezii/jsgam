import * as PIXI from 'pixi.js';
window.PIXI=PIXI; //Solution to use Dragonbones with PIXI v5
const dragonBones=require('pixi5-dragonbones');
const dbfactory=dragonBones.PixiFactory.factory;
import {checkPath} from '../collisions.js'

import { TweenMax } from "gsap";
import PixiPlugin from "gsap/PixiPlugin";

class Character{
  constructor(){
    this.game=null;
    this.state=null;
    this.lock=false;
    this.endAction=null;
  }

  setup(config){
    dbfactory.parseDragonBonesData(this.game.files.resources[config.Name+"Skeleton"].data);
    dbfactory.parseTextureAtlasData(this.game.files.resources[config.Name+"Json"].data,this.game.files.resources[config.Name+"Tex"].texture);
    this.sprite = dbfactory.buildArmatureDisplay(config.Armature);
    if(config.Size!==undefined){
      this.size=config.Size;
      this.sprite.scale.set(this.size);
    }else{
      this.size=1;
    }
    this.tween=null;
    if(config.Animations!=undefined)
      this.animations=config.Animations;
    else
      this.animations={
        Stand:"stand",
        Walk:"walk",
        Take:"take",
        Use:"use",
        Say:"speak"
      };
    this.animate(this.animations.Stand);
    this.state="stand";
    if(config.Position){
      this.sprite.x=config.Position[0];
      this.sprite.y=config.Position[1];
    }
    this.sprite.parentLayer = this.game.layer;//Z-order*/
    this.config=config;
  }

  hide(){
    this.sprite.visible=false;
  }

  show(){
    this.sprite.visible=true;
  }

  width(){
    return this.sprite.getBounds().width;
  }

  position(coords){
    this.sprite.x=coords[0];
    this.sprite.y=coords[1];
  }

  move(coords){
    let obstacles=this.game.activeScene.config.Obstacles;
    let walkingArea=this.game.activeScene.config.WalkArea;
    let newPosition=coords;
    let closestPosition=checkPath(coords,obstacles,walkingArea);

    if(closestPosition){
      newPosition=closestPosition;
    }

    let findPath=this.game.activeScene.walkable.findPath(this.sprite.x,this.sprite.y,newPosition.x,newPosition.y,0);
    let i;
    let finalPath=[];
    for(i=0;i<findPath.length;i++){
      finalPath.push({x:findPath[i],y:findPath[i+1]})
      i++;
    }

    if(finalPath.length>0){
      let animationTime=Math.abs(this.sprite.x-newPosition.x)+Math.abs(this.sprite.y-newPosition.y);
      animationTime=animationTime/(this.game.width+this.game.height);
      animationTime*=10;
      if(this.config.Speed!==undefined) animationTime/=this.config.Speed;

      this.animate(this.animations.Walk);
      if(this.sprite.x<newPosition.x) this.sprite.armature.flipX=false;
      else this.sprite.armature.flipX=true;

      this.game.activeState=this;

      if(this.tween!==null) this.tween.kill();
      this.tween=TweenMax.to(this.sprite, animationTime, {bezier:finalPath, ease:Linear.easeNone,onComplete:this.stop.bind(this)});
    }
  }

  update(){
    this.scale();
  }

  scale(){
    let scaleChar=this.sprite.y/this.game.height*this.size;
    if(scaleChar<this.game.activeScene.config.Depth) scaleChar=this.game.activeScene.config.Depth;
    this.sprite.scale.set(scaleChar);
  }

  stop(){
    this.animate(this.animations.Stand);
    this.game.activeState=null;
    this.lock=false;
    if(this.endAction!==null){
      if(this.endAction==="Look") this.look();
      else if(this.endAction==="Take") this.take();
      else if(this.endAction==="Use") this.use();
      else if(this.endAction==="Talk") this.talk();
      this.endAction=null;
    }
  }

  say(text,voice){
    this.game.textField.talker=this;
    //Setup the text to show
    this.game.textField.setText(text);
    this.game.textField.setAvatar(this.config.Avatar);
    if(this.config.Color!==undefined) this.game.textField.setColor(Number(this.config.Color));
    if(this.config.Font!==undefined) this.game.textField.setFont(this.config.Font);
    else this.game.textField.setFont(this.game.settings.Text.Style.font)

    //Play voice if it's defined
    if(voice!==undefined && this.config.VoiceSet!=undefined){
      this.game.activeVoice=this.config.VoiceSet;
      this.game.voices[this.config.VoiceSet].play(null,voice);
    }

    this.game.textField.show();
    //Animate the character
    this.animate(this.animations.Say);
    if(this.timeoutID) clearTimeout(this.timeoutID);
    this.timeoutID=setTimeout(this.game.textField.end.bind(this.game.textField), this.game.textField.timeOut());
  }

  shutup(){
    if(this.game.activeVoice!=null){
      this.game.voices[this.config.VoiceSet].stop();
      this.game.activeVoice=null
    }
    this.animate(this.animations.Stand);
  }

  animate(animation,times){
    if(this.sprite.animation.lastAnimationName!==animation)
      this.sprite.animation.fadeIn(animation,0.25,times);
  }
}

export default Character;
