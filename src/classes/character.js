import {game} from '../game.js';
import * as PIXI from 'pixi.js';
import {dragonBones} from '../../lib/dragonBones.js';
import {checkPath} from './utils.js';
//import tweenManager from 'k8w-pixi-tween';

const factory=dragonBones.PixiFactory.factory;
export class Character{
    constructor(data){
      this.data=data;
      factory.parseDragonBonesData(game.resources[data.name+'Skeleton'].data);
      factory.parseTextureAtlasData(game.resources[data.name+'Json'].data,game.resources[data.name+'Tex'].texture);
      this.sprite = factory.buildArmatureDisplay(data.Name);
    //  this.tween=PIXI.tweenManager.createTween(this.sprite);
      this.name=data.Name;
      this.sprite.animation.play(data.Animation);
      this.sprite.x=data.Position[0];
      this.sprite.y=data.Position[1];
      if(data.Size) this.sprite.scale.set(data.Size);
      this.sprite.parentLayer = game.layer;//Z-order
    }
/*
    move(newPosition){
      if(!this.lock)
      {
        clearTimeout(game.timeout);
        game.inventory.hide();
        game.playerText.visible=false;
        //var newPosition=event.data.getLocalPosition(game.app.stage);
        let obstacles=game.scenes[game.currentScene].obstacles;
        let walkingArea=game.scenes[game.currentScene].walkArea;
        let pathResult=checkPath(newPosition,obstacles,walkingArea);
        if(pathResult){
          newPosition=pathResult;
        }

        var path = new PIXI.tween.TweenPath();

        let findPath=game.scenes[game.currentScene].getPath(this.sprite.x,this.sprite.y,newPosition.x,newPosition.y);
        if(findPath.length>0){
          this.animate("walk");
          this.lock=true;
          if(this.sprite.x<newPosition.x) this.sprite.armature.flipX=false;
          else this.sprite.armature.flipX=true;
          path.drawShape(new PIXI.Polygon(findPath));
          this.tween.path=path;
          //Needs improvement
          let animationTime=Math.abs(this.sprite.x-newPosition.x)*5+Math.abs(this.sprite.y-newPosition.y)*5+findPath.length*100;

          this.tween.time = animationTime;
          this.tween.speed = 1;
          this.tween.start();
          this.tween.on('end', playerStop);
        }
      }
    }

    say(textToSay){
      game.player.lock=true;
      game.playerText.text=textToSay;
      let textInfo=game.playerText.getBounds();
      let playerPos=game.player.sprite.getBounds();
      let textPosX=playerPos.x+playerPos.width/2;
      if(textPosX+textInfo.width>game.app.screen.width) textPosX=game.app.screen.width-textInfo.width;
      game.playerText.x=textPosX;
      game.playerText.y=playerPos.y;
      game.playerText.visible=true;
      game.player.sprite.animation.stop();
      this.animate("speak");
    }

    animate(animation,times){
      this.sprite.animation.play(animation,times);
    }*/
};

function playerStop(){
  let wait=0;
  if(game.selectedObject){
    wait=1000;
    let currentObject=game.objects[game.selectedObject];
    if(game.player.action=="use" && currentObject.use || currentObject.door){
      game.player.animate("take",1);
      setTimeout(currentObject.use, 500);
    }else if(game.player.action=="take"){
      game.player.animate("take",1);
      currentObject.take();
    }else{
      game.player.say(currentObject.description[game.mainLanguage]);
      wait=3000;
    }
  }
  game.timeout=setTimeout(defautState, wait);
}

function defautState(){
  game.player.animate("stand");
  game.player.lock=false;
  game.player.action=null;
  game.selectedObject=null;
  game.playerText.visible=false;
}
