import * as PIXI from 'pixi.js';
window.PIXI=PIXI; //Solution to use dragonbones with PIXI v5
const dragonBones=require('pixi5-dragonbones');
const dbfactory=dragonBones.PixiFactory.factory;
import { gsap } from "gsap";

import {checkPath,collision} from '../collisions.js'

class Character{
  constructor(game){
    this.game=game;
    this.state=null;
    this.lock=false;
    this.endAction=null;
    this.event=dragonBones.EventObject;
  }

  setup(config){
    dbfactory.parseDragonBonesData(this.game.files.resources[config.Name+"Skeleton"].data);
    dbfactory.parseTextureAtlasData(this.game.files.resources[config.Name+"Json"].data,this.game.files.resources[config.Name+"Tex"].texture);
    this.defaultSkin=dbfactory.buildArmatureDisplay(config.Armature);
    this.sprite = this.defaultSkin;

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
    //Añadir velocidad
  }

  hide(){
    this.sprite.visible=false;
  }

  show(){
    this.sprite.visible=true;
  }

  unlock(){
    this.lock=false;
  }

  width(){
    return this.sprite.getBounds().width;
  }

  position(coords){
    this.sprite.x=coords[0];
    this.sprite.y=coords[1];
  }

  move(coords){
    if(this.sprite.x!=coords.x || this.sprite.y!=coords.y){
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

      //Check we have a path to move
      if(finalPath.length>0 && Math.abs(finalPath[0].x-finalPath[finalPath.length-1].x)>1){

        let animationTime=Math.abs(this.sprite.x-newPosition.x)+Math.abs(this.sprite.y-newPosition.y);
        animationTime=animationTime/(this.game.width+this.game.height);

        animationTime*=10;
        animationTime=animationTime+finalPath.length/20;
        if(this.config.Speed!==undefined) animationTime+finalPath.length/(20*this.config.Speed);

        this.animate(this.animations.Walk);
        if(this.sprite.x<newPosition.x) this.sprite.armature.flipX=false;
        else this.sprite.armature.flipX=true;

        this.game.movingState=this;

        if(this.tween!==null) this.tween.kill();
        this.lock=true;
        this.tween=gsap.to(this.sprite, {duration: animationTime, motionPath:finalPath, ease:"none",onComplete:this.stop.bind(this)});

      }else{
        this.stop();
      }
    }else{
      this.stop();
    }
  }

  update(){
    this.scale();
  }

  scale(){
    let scaleChar=this.sprite.y/this.game.height*this.size;
    let depths=this.game.activeScene.config.Depth;
    let scaleRatio=this.game.activeScene.config.ScaleRatio;

    if(scaleRatio!==undefined){
      scaleChar*=scaleRatio;
    }

    if(depths!==undefined){
      depths.forEach((element) => {
        if(collision(this.sprite,element)) scaleChar=element.Size;
      });
    }

    this.sprite.scale.set(scaleChar);
  }

  stop(){
    this.animate(this.animations.Stand);
    this.game.movingState=null;

    if(this.endAction!==null){
      if(this.endAction==="Look") this.look();
      else if(this.endAction==="Take") this.take();
      else if(this.endAction==="Use") this.use();
      else if(this.endAction==="Talk") this.talk();
      this.endAction=null;
    }else this.unlock();
  }

  stand(){
    this.animate(this.animations.Stand);
    this.game.movingState=null;
  }

  say(text,voice){
    this.game.textField.talker=this;
    //Setup the text to show
    if(this.config.Color!==undefined) this.game.textField.setColor(Number(this.config.Color));
    else this.game.textField.setColor(0xffffff);
    if(this.config.Font!==undefined) this.game.textField.setFont(this.config.Font.fontName);
    else this.game.textField.setFont(this.game.settings.Text.Style.fontName)
    this.game.textField.setText(text);
    this.game.textField.setAvatar(this.config.Avatar);

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
    //this.animate(this.animations.Stand);
    this.stand();
  }

  animate(animation,times){
    if(this.sprite.animation.lastAnimationName!==animation)
      this.sprite.animation.fadeIn(animation,0.25,times);
  }

  changeSkin(armature){
    let currentParent=this.sprite.parent;

    if(armature=="Default"){
      this.defaultSkin.x=this.sprite.x;
      this.defaultSkin.y=this.sprite.y;
      currentParent.removeChild(this.sprite);
      currentParent.addChild(this.defaultSkin);
      this.sprite=this.defaultSkin;
    }else{
      this.game.npcs[armature].sprite.x=this.sprite.x;
      this.game.npcs[armature].sprite.y=this.sprite.y;
      currentParent.removeChild(this.sprite);
      currentParent.addChild(this.game.npcs[armature].sprite);
      this.sprite=this.game.npcs[armature].sprite;
    }
  }
}

export default Character;
