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
import '../demo/index.js';
//////////////////////////////////
