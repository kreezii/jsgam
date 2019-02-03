import {game,dbfactory} from '../game.js';
import {checkPath} from '../collisions.js';

export class Player{
    constructor(armature){
      dbfactory.parseDragonBonesData(game.resources.playerSkeleton.data);
      dbfactory.parseTextureAtlasData(game.resources.playerJson.data,game.resources.playerTex.texture);
      this.sprite = dbfactory.buildArmatureDisplay(armature);
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
        game.textField.hide();
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
      game.textField.Field.text=textToSay;
      game.textField.Field.tint=0xFFFFFF;
      game.textField.show();
      this.animate("speak",3);
      if(game.timeout) game.timeout.clear();
      game.timeout = PIXI.setTimeout(game.settings.TextSpeed,function(){game.textField.hide();})
    }

    stand(){
      if(!game.currentDialogue) this.lock=false;
      this.action=null;
      game.selectedObject=null;
      this.animate("stand");
    }

    animate(animation,times){
      this.sprite.animation.fadeIn(animation,0.25,times);
      //this.state=animation;
    }
};

function tweenEnd(){
  if(game.selectedObject!=null){

    let currentObject=game.objects[game.selectedObject];
    //Check the player is facing the object, ignore if it's a door
    if(!currentObject.door){
      if(game.player.sprite.x<currentObject.x) game.player.sprite.armature.flipX=false;
      else game.player.sprite.armature.flipX=true;
    }
    if(game.player.action=="use"){
      game.player.animate("use",1);
    }else if(game.player.action=="take"){
      game.player.animate("take",1);
    }else if(game.player.action=="look"){
    //  game.player.animate("speak",3);
      game.player.say(currentObject.data.Description[game.mainLanguage]);
    }
  }else if(game.selectedCharacter!=null){
    let currentCharacter=game.characters[game.selectedCharacter].sprite;
    if(game.player.sprite.x<currentCharacter.x) game.player.sprite.armature.flipX=false;
    else game.player.sprite.armature.flipX=true;

    if(game.player.action=="look"){
//      game.player.animate("speak",3);
      game.player.say(currentCharacter.data.Description[game.mainLanguage]);
    }else if(game.player.action=="talk"){
      game.currentDialogue.start();
    //  game.player.animate("speak",3);
    //  game.player.say(game.currentDialogue.data.Intro[game.mainLanguage]);
    }
  }else{
     game.player.stand();
   }
}
