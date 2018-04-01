import {game,stopPlayer} from '../game.js';
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
      this.sprite.x=100;
      this.sprite.y=300;
      this.sprite.scale.set(0.2);
      this.sprite.parentLayer = game.layer;//Z-order
  //    this.sprite.parentGroup = game.sortGroup;//Z-order
    }

    move(event){
      if(!this.tween.active){
        var newPosition=event.data.getLocalPosition(game.app.stage);
        this.sprite.animation.play("walk");

        if(this.sprite.x<newPosition.x) this.sprite.armature.flipX=true;
        else this.sprite.armature.flipX=false;

        this.tween.from({ x: this.sprite.x, y:this.sprite.y});
        this.tween.to({ x: newPosition.x, y:newPosition.y});
        this.tween.time = 1000;
        this.tween.speed = 0.5;
        this.tween.start();
        this.tween.on('end',stopPlayer);
      }
    }
};
