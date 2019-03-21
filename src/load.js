import {game} from './game.js';
import {Scene} from './classes/scene.js';
import {CutScene} from './classes/cutscene.js';
import {TitleScreen} from './classes/title.js';
import {LogoScreen} from './classes/logo.js';
import {Objeto} from './classes/object.js';
import {Character} from './classes/character.js';
import {Dialogue} from './classes/dialogue.js';
import {Player} from './classes/player.js';
import {Puzzle} from './classes/puzzle.js';
import {Inventory} from './classes/inventory.js';
import {TextField} from './classes/text.js'

//Called when a file is loaded
function loadingProgress(loader,resources){
  let percent=Math.floor(PIXI.loader.progress);
  game.loadingText.text=percent+ "%";
};

//Load JSON configuration files
function loadConfigFiles(loader,resources){
  let vidFiles;
  let sndFiles;
  let animFiles;

  game.loadingText.visible=false;
  //Temporary store the config files
  for(let i=0;i<game.files.length;i++){
    if(resources[game.files[i]].data==null){
      //Show a message in console if find something wrong in JSON's files
      console.log("Error found in JSON file:"+" '"+game.files[i]+"'");
    }else if(resources[game.files[i]].data.Scenes){
      let tempArray=game.scenesJSON.concat(resources[game.files[i]].data.Scenes);
      game.scenesJSON=tempArray;
    }else if(resources[game.files[i]].data.Cutscenes){
      let tempArray=game.cutscenesJSON.concat(resources[game.files[i]].data.Cutscenes);
      game.cutscenesJSON=tempArray;
    }else if(resources[game.files[i]].data.Objects){
      let tempArray=game.objectsJSON.concat(resources[game.files[i]].data.Objects);
      game.objectsJSON=tempArray;
    }else if(resources[game.files[i]].data.Player){
      game.playerJSON=resources[game.files[i]].data.Player;
    }else if(resources[game.files[i]].data.Characters){
      let tempArray=game.charactersJSON.concat(resources[game.files[i]].data.Characters);
      game.charactersJSON=tempArray;
    }else if(resources[game.files[i]].data.Dialogues){
      let tempArray=game.dialoguesJSON.concat(resources[game.files[i]].data.Dialogues);
      game.dialoguesJSON=tempArray;
    }else if(resources[game.files[i]].data.Puzzles){
      let tempArray=game.puzzlesJSON.concat(resources[game.files[i]].data.Puzzles);
      game.puzzlesJSON=tempArray;
    }else if(resources[game.files[i]].data.Credits){
      game.creditsJSON=resources[game.files[i]].data.Credits;
    }else if(resources[game.files[i]].data.Settings){
      game.settings=resources[game.files[i]].data.Settings;
    }else if(resources[game.files[i]].data.Sounds){
      sndFiles=resources[game.files[i]].data.Sounds;
    }else if(resources[game.files[i]].data.Vids){
      vidFiles=resources[game.files[i]].data.Vids;
    }else if(resources[game.files[i]].data.Animations){
      animFiles=resources[game.files[i]].data.Animations;
    }
  }

  PIXI.loader.reset();
  game.loadingText.visible=true;
  PIXI.loader.onLoad.add(loadingProgress);

  //Load Sounds
  let soundSrc=sndFiles;
  for(let i=0;i<soundSrc.length;i++){
    let tmpSound=soundSrc[i].Src;
    if(tmpSound!="") PIXI.loader.add(soundSrc[i].Name,tmpSound);
  }

  //Fix for load mp4 as videos instead as audio because of pixi-sound
  PIXI.sound.utils.extensions.splice(PIXI.sound.utils.extensions.indexOf('mp4'), 1);
  PIXI.loaders.Resource.setExtensionXhrType('mp4', undefined);
  PIXI.loaders.Resource.setExtensionLoadType('mp4', PIXI.loaders.Resource.LOAD_TYPE.VIDEO);

  //Load Vids
  let vidSrc=vidFiles;
  for(let i=0;i<vidSrc.length;i++){
    let tmpVid=vidSrc[i].Src;
    if(tmpVid!="") PIXI.loader.add(vidSrc[i].Name,tmpVid);
  }

  //Load Animations
  let animSrc=animFiles;
  for(let i=0;i<animSrc.length;i++){
    let tmpAnim=animSrc[i].Src;
    if(tmpAnim!="") PIXI.loader.add(animSrc[i].Name,tmpAnim);
  }

  //Load Player resources
  PIXI.loader.add('playerTex', game.playerJSON.Texture)
  .add('playerJson', game.playerJSON.Json)
  .add('playerSkeleton', game.playerJSON.Skeleton);

  //Load Character resources
  let tempCharas=game.charactersJSON;
  for(let i=0;i<tempCharas.length;i++){
    PIXI.loader.add(tempCharas[i].Name+"Tex", tempCharas[i].Texture)
    .add(tempCharas[i].Name+'Json', tempCharas[i].Json)
    .add(tempCharas[i].Name+'Skeleton', tempCharas[i].Skeleton);
  }

  PIXI.loader.load(buildGame);
};

//Create all elements and add it to the game (PIXI.stage)
function buildGame(loader,resources){
  game.loadingText.destroy(); //We don't need it anymore

  //Build Player
  game.player=new Player(game.playerJSON.Armature);
  game.app.stage.addChild(game.player.sprite);
  delete game.playerJSON;

  //Build inventory
  game.inventory=new Inventory();
  game.app.stage.addChild(game.inventory.container);
  game.app.stage.addChild(game.inventory.icon);
  game.inventory.setIcon(game.settings.Inventory.Position); //Create settings.json to change pos

  //Build objects
  for(let i=0;i<game.objectsJSON.length;i++){
    game.objects[i]=new Objeto(game.objectsJSON[i],i);
  }
  delete game.objectsJSON;

  //Build puzzles
  for(let i=0;i<game.puzzlesJSON.length;i++){
    game.puzzles[i]=new Puzzle(game.puzzlesJSON[i],i);
  }
  delete game.puzzlesJSON;

  //Build dialogues
  for(let i=0;i<game.dialoguesJSON.length;i++){
    game.dialogues[i]=new Dialogue(game.dialoguesJSON[i],i);
  }
  delete game.dialoguesJSON;

  //Build characters
  for(let i=0;i<game.charactersJSON.length;i++){
    game.characters[i]=new Character(game.charactersJSON[i],i);
  }
  delete game.charactersJSON;

  //Build Logo and Main screens
  game.logoScreen=new LogoScreen();
  game.titleScreen=new TitleScreen();

  //Build Scenes
  for(let i=0;i<game.scenesJSON.length;i++){
    game.scenes[i]=new Scene(game.scenesJSON[i],i);
    game.app.stage.addChild(game.scenes[i].container);
  }
  delete game.scenesJSON;

  //Build CutScenes
  for(let i=0;i<game.cutscenesJSON.length;i++){
    game.cutscenes[i]=new CutScene(game.cutscenesJSON[i],i);
    game.app.stage.addChild(game.cutscenes[i].container);
  }
  delete game.cutscenesJSON;

  //Build text fields
  game.textField=new TextField();
  game.app.stage.addChild(game.textField.container);

  PIXI.loader.reset();

  //Game loop start
  game.ticker=new PIXI.ticker.Ticker();
  game.ticker.add(deltaTime=>game.loop(deltaTime));
  game.ticker.start();

  //Launch the game
  game.start();
};

export {
  loadingProgress,
  loadConfigFiles
};
