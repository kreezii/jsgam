import {game} from '../game.js';
import {dragonBones} from '../../lib/dragonBones.js';
import {checkPath} from './utils.js';

const factory=dragonBones.PixiFactory.factory;
export class Player{
    constructor(armature){
      factory.parseDragonBonesData(game.resources.playerSkeleton.data);
      factory.parseTextureAtlasData(game.resources.playerJson.data,game.resources.playerTex.texture);
      this.sprite = factory.buildArmatureDisplay(armature);
      this.tween=PIXI.tweenManager.createTween(this.sprite);
      this.tween.on('end', tweenEnd);
      this.sprite.animation.play("stand");
      this.state="stand";
      this.sprite.visible=false;
      this.sprite.x=0;
      this.sprite.y=0;
      this.action=null;
      this.lock=false;
      this.sprite.parentLayer = game.layer;//Z-order
    }

    move(newPosition){
      if(!this.tween.active)
      {
        game.inventory.hide();
        game.playerText.hide();
        //var newPosition=event.data.getLocalPosition(game.app.stage);
        let obstacles=game.scenes[game.currentScene].data.Obstacles;
        let walkingArea=game.scenes[game.currentScene].data.WalkArea;
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
        }
      }
    }

    say(textToSay){
      game.playerText.Text.text=textToSay;
      game.playerText.show();
      if(game.timeout) game.timeout.clear();
      game.timeout = PIXI.setTimeout(10,function(){game.playerText.hide();})
    }

    stand(){
      this.lock=false;
      this.action=null;
      game.selectedObject=null;
      this.animate("stand");
    }

    animate(animation,times){
      this.sprite.animation.fadeIn(animation,0.25,times);
      this.state=animation;
    }
};

function tweenEnd(){

  if(game.selectedObject){
    let currentObject=game.objects[game.selectedObject];
    //Check the player is facing the object
  //  if(game.player.sprite.x<currentObject.x) game.player.sprite.armature.flipX=false;
  //  else game.player.sprite.armature.flipX=true;

    if(game.player.action=="use"){
      game.player.animate("use",1);
    }else if(game.player.action=="take"){
      game.player.animate("take",1);
    }else{
      game.player.animate("speak",3);
      game.player.say(currentObject.data.Description[game.mainLanguage]);
    }
  }else{
     game.player.stand();
   }
}
