import {game} from '../game.js';
import * as PIXI from 'pixi.js';
import {dragonBones} from '../../lib/dragonBones.js';
import tweenManager from 'k8w-pixi-tween';

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
      this.sprite.scale.set(0.2);
      this.sprite.parentLayer = game.layer;//Z-order
    }

    move(event){
      if(!this.tween.active){
        var newPosition=event.data.getLocalPosition(game.app.stage);
        this.sprite.animation.play("walk");

        if(this.sprite.x<newPosition.x) this.sprite.armature.flipX=true;
        else this.sprite.armature.flipX=false;

        var path = new PIXI.tween.TweenPath();

        let findPath=game.scenes[game.currentScene].getPath(this.sprite.x,this.sprite.y,newPosition.x,newPosition.y);
        path.drawShape(new PIXI.Polygon(findPath));
        this.tween.path=path;
        this.tween.time = 1000;
        this.tween.speed = 0.5;
        this.tween.start();
        this.tween.on('end',function(){
          game.player.sprite.animation.play("stand");
          if(game.selectedObject) game.showMenu(game.selectedObject);
        });
      }
    }
};
