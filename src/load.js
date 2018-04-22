import {game} from './game.js';
import {gameScene} from './classes/scenes.js';
import {gameObject} from './classes/objects.js';
import {Player} from './classes/player.js'
import {Menu} from './classes/menu.js'
import {Inventory} from './classes/inventory.js'

function loadingProgress(loader,resources){
  let percent=Math.floor(PIXI.loader.progress);
  game.loadingText.text="Loading "+percent+ "%";
  console.log(percent);
};

function loadConfigFiles(loader,resources){
  game.loadingText.visible=false;
  for(let i=0;i<game.files.length;i++){
    if(resources[game.files[i]].data.Scenes){
      let tempArray=game.scenesJSON.concat(resources[game.files[i]].data.Scenes);
      game.scenesJSON=tempArray;
    }else if(resources[game.files[i]].data.Objects){
      let tempArray=game.objectsJSON.concat(resources[game.files[i]].data.Objects);
      game.objectsJSON=tempArray;
    }
  }

  PIXI.loader.reset();
  game.loadingText.visible=true;
  PIXI.loader.onProgress.add(loadingProgress);

  //Load Sounds
  let soundSrc=resources["sounds"].data.Sounds;
  for(let i=0;i<soundSrc.length;i++){
    let tmpSound=soundSrc[i].Src;
    if(tmpSound!="") PIXI.loader.add(soundSrc[i].Name,tmpSound);
  }

  //Load Player resources
  PIXI.loader.add('playerTex', resources["player"].data.Player.Texture)
  .add('playerJson', resources["player"].data.Player.Json)
  .add('playerSkeleton', resources["player"].data.Player.Skeleton);

  PIXI.loader.load(buildGame);
};

function buildGame(loader,resources){
  game.loadingText.destroy();
  game.resources=resources;

  //Build Player
  game.player=new Player("Dragon");
  game.app.stage.addChild(game.player.sprite);

  //Build inventory
  game.inventory=new Inventory();
  game.app.stage.addChild(game.inventory.container);
  game.app.stage.addChild(game.inventory.icon);

  //Build context menu
  game.actionMenu=new Menu();
  game.app.stage.addChild(game.actionMenu.container);

  //Build objects
  for(let i=0;i<game.objectsJSON.length;i++){
    game.objects[i]=new gameObject(game.objectsJSON[i],i);
  }

  //Build Scenes
  for(let i=0;i<game.scenesJSON.length;i++){
    game.scenes[i]=new gameScene(game.scenesJSON[i],i);
    game.app.stage.addChild(game.scenes[i].container);
  }

  PIXI.loader.reset();
  game.ticker=new PIXI.ticker.Ticker();
  game.ticker.add(deltaTime=>game.loop(deltaTime));
  game.ticker.start();
  game.start();
};

export {
  loadingProgress,
  loadConfigFiles
};
