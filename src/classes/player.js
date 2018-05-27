import {game} from '../game.js';
import * as PIXI from 'pixi.js';
import {dragonBones} from '../../lib/dragonBones.js';

import {checkPath} from './utils.js';
//import tweenManager from 'k8w-pixi-tween';

const factory=dragonBones.PixiFactory.factory;
export class Player{
    constructor(armature){
      factory.parseDragonBonesData(game.resources.playerSkeleton.data);
      factory.parseTextureAtlasData(game.resources.playerJson.data,game.resources.playerTex.texture);
      this.sprite = factory.buildArmatureDisplay(armature);
      this.tween=PIXI.tweenManager.createTween(this.sprite);
      this.sprite.animation.play("stand");
      this.sprite.visible=false;
      this.sprite.x=0;
      this.sprite.y=0;
      //this.sprite.scale.set(2);
      this.sprite.parentLayer = game.layer;//Z-order
      this.lock=false;
    }

    move(event){
      if(!this.lock)
      {
        game.hideMenu();
        var newPosition=event.data.getLocalPosition(game.app.stage);
        let obstacles=game.scenes[game.currentScene].obstacles;
        let walkingArea=game.scenes[game.currentScene].walkArea;
        let pathResult=checkPath(newPosition,obstacles,walkingArea);
        if(pathResult){
          newPosition=pathResult;
        }

        var path = new PIXI.tween.TweenPath();

        let findPath=game.scenes[game.currentScene].getPath(this.sprite.x,this.sprite.y,newPosition.x,newPosition.y);
        if(findPath.length>0){
          this.sprite.animation.play("walk");
          this.lock=true;
          if(this.sprite.x<newPosition.x) this.sprite.armature.flipX=false;
          else this.sprite.armature.flipX=true;
          //let findPath=getPath({x:this.sprite.x,y:this.sprite.y},newPosition,game.scenes[game.currentScene].obstacles);
          path.drawShape(new PIXI.Polygon(findPath));
          this.tween.path=path;
          let animationTime=Math.abs(this.sprite.x-newPosition.x)*10+Math.abs(this.sprite.y-newPosition.y)*10;
          this.tween.time = animationTime;
          this.tween.speed = 1;
          this.tween.start();
          this.tween.on('end', playerStop);
        }
      }
    }

    talk(){

    }
};

function playerStop(){
  game.player.lock=false;
  game.player.sprite.animation.play("stand");
  if(game.selectedObject) game.showMenu();
}
