import {Core} from './classes/core.js';
import {loadingProgress,loadConfigFiles} from './load.js';
var game;

function init(width,height,objectID){
  game=new Core(width,height,objectID);
};

function loadDefaults(){
  //addFile("scenes.json");
};

function load(resource){
  //Add name to loader from filename
  for(let i=0;i<resource.length;i++){
    let name=resource[i].slice(resource[i].lastIndexOf("/")+1,resource[i].lastIndexOf("."));
    game.files.push(name);
    PIXI.loader.add(name,resource[i]);
  }
};

function run(){
  game.loadingText.anchor.set(0.5);
  game.loadingText.x=game.app.screen.width/2;
  game.loadingText.y=game.app.screen.height/2;
  game.app.stage.addChild(game.loadingText);
  PIXI.loader.onProgress.add(loadingProgress);
  PIXI.loader.load(loadConfigFiles);
};

export {
  game,
  init,
  loadDefaults,
  load,
  run
};
