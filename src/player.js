import {game} from './core.js';
import * as PIXI from 'pixi.js';
import {dragonBones} from '../lib/dragonBones.js';
import tweenManager from 'k8w-pixi-tween';

const factory=dragonBones.PixiFactory.factory;
export class Player{
    constructor(){
      factory.parseDragonBonesData(game.resources.playerSkeleton.data);
      factory.parseTextureAtlasData(game.resources.playerJson.data,game.resources.playerTex.texture);
      this.sprite = factory.buildArmatureDisplay("Dragon");
      this.sprite.playerTween=PIXI.tweenManager.createTween(game.player);
      this.sprite.visible=false;
      this.sprite.x=100;
      this.sprite.y=300;
      this.sprite.scale.set(0.2);
      this.sprite.anchor.set(0.5,1);
    }
}
