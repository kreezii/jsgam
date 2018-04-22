/**
 * @namespace JSGAM
 */


import * as PIXI from 'pixi.js';
import tweenManager from 'k8w-pixi-tween';
import 'pixi-layers';
import 'pixi-sound';
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
JSGAM.load(['/demo/sources/scenes.json',
            '/demo/sources/objects.json',
            '/demo/sources/atlas.json',
            '/demo/sources/sceneAtlas.json',
            '/demo/sources/player.json',
            '/demo/sources/sounds.json'
          ]
);
//Add game logics function
JSGAM.main(gameConfig);
//Run the game
JSGAM.run();


//Game logics
function gameConfig(){
  JSGAM.mainScene("Title");
  JSGAM.inventoryPosition(0,0,150,150);
}
//////////////////////////////////
