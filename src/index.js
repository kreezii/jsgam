/**
 * @namespace JSGAM
 */


import * as PIXI from 'pixi.js';
import tweenManager from 'k8w-pixi-tween';
import 'pixi-layers';
import {dragonBones} from '../lib/dragonBones.js';
import './version.js';
const factory=dragonBones.PixiFactory.factory;
export * from './game.js';


//Testing area (TEMPORAL)
//////////////////////////////////
import * as JSGAM from './game.js'
//Set screen size
JSGAM.init(800,600);

//Add resource files
JSGAM.load(['/test/sources/scenes.json',
            '/test/sources/objects.json',
            '/test/sources/atlas.json',
            '/test/sources/player.json',
          ]
);
//Add game logics function
JSGAM.main(gameConfig);
//Run the game
JSGAM.run();


//Game logics
function gameConfig(){
  JSGAM.mainScene("Title");
  //JSGAM.game.player.move();
}
//////////////////////////////////
