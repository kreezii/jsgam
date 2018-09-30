import {Core} from './classes/core.js';
import {loadingProgress,loadConfigFiles} from './load.js';

//Global variables
var game;
const dbfactory=dragonBones.PixiFactory.factory;

//Initialize the game
function init(width,height,objectID){
  game=new Core(width,height,objectID);
};

function loadDefaults(){
  //addFile("scenes.json");
};

//Add a file to the loader
function load(resource){
  //Add name to loader from filename
  for(let i=0;i<resource.length;i++){
    let name=resource[i].slice(resource[i].lastIndexOf("/")+1,resource[i].lastIndexOf("."));
    game.files.push(name);
    PIXI.loader.add(name,resource[i]);
  }
};

//Show the loading progress and run the game
function run(){
  game.resize();//Adjust the size to the window
  game.loadingText.anchor.set(0.5);
  game.loadingText.x=game.width/2;
  game.loadingText.y=game.height/2;
  game.app.stage.addChild(game.loadingText);
  PIXI.loader.onProgress.add(loadingProgress);
  PIXI.loader.load(loadConfigFiles);
};

export {
  game,
  dbfactory,
  init,
  loadDefaults,
  load,
  run
};
