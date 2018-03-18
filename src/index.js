/**
 * @namespace JSGAM
 */


import * as PIXI from 'pixi.js';
import tweenManager from 'k8w-pixi-tween';
import {dragonBones} from '../lib/dragonBones.js';
import './version.js';

const factory=dragonBones.PixiFactory.factory;

export {game} from './core.js'

//Testing
import {game} from './core.js'
game.create(800,600);
game.addResource('scene','/test/sources/scenes.json');
game.addResource('ui','/test/sources/ui.json');
game.addResource('player','/test/sources/player.json');


game.main=function(){
//game.scenes[1].objects[0].sprite.off('pointerup');
//game.scenes[1].objects[0].sprite.on('pointerup', function(){console.log("Now you do it");});
//if(game.scenes[game.currentScene].name=="Entrada") console.log("Hey!");
console.log();
}

game.load();
