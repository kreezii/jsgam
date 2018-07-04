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
      this.sprite.parentLayer = game.layer;//Z-order
      this.lock=false;
    }

    move(event){
      if(!this.lock)
      {
        clearTimeout(game.timeout);
        game.inventory.hide();
        game.playerText.visible=false;
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
      this.sprite.animation.play("speak");
      game.timeout=setTimeout(shutUp, 3000);
    }
};

function playerStop(){
  game.player.sprite.animation.play("stand");

  if(game.selectedObject){
    let currentObject=game.objects[game.selectedObject];
    if(game.longPress && currentObject.use || currentObject.door){
      currentObject.use();
    }else{
      game.player.say(currentObject.description[game.mainLanguage]);
    }
    game.longPress=false;
  }
  game.player.lock=false;
}

function shutUp(){
  game.player.sprite.animation.play("stand");
  game.player.lock=false;
  game.selectedObject=null;
  game.playerText.visible=false;
}
