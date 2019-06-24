import * as PIXI from 'pixi.js';
import 'pixi-sound';
import 'pixi-layers';

import Loader from './loader.js';
import Storage from './storage.js';
import Title from './class/title.js';
import GameScene from './class/gamescene.js';
import CutScene from './class/cutscene.js';
import GameObject from './class/gameobject.js';
import Inventory from './class/inventory.js';
import Puzzle from './class/puzzle.js';
import {TextField} from './class/text.js';
import Player from './class/player.js';
import NPC from './class/npc.js';
import Dialogue from './class/dialogue.js';

class Game {
  constructor(config){
    this.settings={};
    this.data={
      scenes:[],
      cutscenes:[],
      objects:[],
      dialogues:[],
      puzzles:[],
      credits:[],
      texts:[]
    };
    this.width=config.width;
    this.height=config.height;
    this.holdTime=500;
    this.playSounds = true;

    //Setup the application
    this.app = new PIXI.Application(
      config.width,config.height,{
      antialias: true,
      autoResize: true,
      resolution: devicePixelRatio
    });

    this.app.stage = new PIXI.display.Stage();

    //Change game size when window size changes
    if(config.autoResize!==undefined) this.app.renderer.autoResize=config.autoResize;
    else window.addEventListener('resize', this.resize.bind(this));

    //Disable contextmenu for mouse interaction
    document.addEventListener('contextmenu', e => {
       e.preventDefault();
    });

    //We append it to a HTML element or Document body
    if(config.parent){
      document.getElementById(config.parent).appendChild(this.app.view)
    }else{
      document.body.appendChild(this.app.view);
    }

    //Load config files
    this.preload(config.files);
  }

  //Read JSON configuration files
  preload(files){
    //Text to show progress
    this.progressBar=new PIXI.Graphics();
    this.progressBar.beginFill(0xDE3249);
    this.progressBar.drawRect(0, 0, this.width, this.height/50);
    this.progressBar.endFill();
    this.progressBar.width=0;

    this.loadingTxt=new PIXI.Text("Loading...", {fill: 'white',"fontSize": 50});
    this.loadingTxt.anchor.set(0.5);
    this.loadingTxt.x=this.width/2;
    this.loadingTxt.y=this.height/2;

    this.progressBar.y=this.height/2+this.loadingTxt.height;

    this.app.stage.addChild(this.loadingTxt);
    this.app.stage.addChild(this.progressBar);
this.resize();
    this.jsons=new Loader();
    this.jsons.game=this;
    this.jsons.addJSON(files);
    this.jsons.load(this.load.bind(this)); //When all config files are loaded, load the game resources.
  }

  //Load game resources (images,sounds,vids...)
  load(){
    this.files=new Loader();
    this.files.game=this;
    this.files.addFiles(Object.values(this.jsons.resources));
    this.files.load(this.setup.bind(this));
  }

  setup(){
    this.app.stage.removeChild(this.loadingTxt);
    this.app.stage.removeChild(this.progressBar);

    //Z-Order
    this.addZOrder();

    //Adjust to window size
    this.resize();

    this.scenes={};
    this.cutscenes={};
    this.objects={};
    this.npcs={};
    this.dialogues={};
    this.puzzles={};

    this.activeLanguage=0;
    this.activeScene=null;
    this.activeObject=null;
    this.activeNPC=null;
    this.activePuzzle=null;
    this.activeDialogue=null;

    this.activeState=null;

    this.storage=new Storage(this);


    if(this.settings.HoldTime!==undefined) this.holdTime=this.settings.HoldTime*1000;
    //Setup title screen
    this.addScene("Title",new Title(),this.settings.TitleScreen);

    //Add game objects
    let i;
    let length=this.data.objects.length;
    for(i=0;i<length;i++)
    {
      this.addObject(this.data.objects[i].Name,new GameObject(),this.data.objects[i]);
    }

    //Non-playable characters
    length=this.data.npc.length;
    for(i=0;i<length;i++)
    {
      this.addNPC(this.data.npc[i].Name,new NPC(),this.data.npc[i]);
    }

    //Dialogues
    length=this.data.dialogues.length;
    for(i=0;i<length;i++)
    {
      this.addDialogue(this.data.dialogues[i].Name,new Dialogue(),this.data.dialogues[i]);
    }

    //Add game scenes
    length=this.data.scenes.length;
    for(i=0;i<length;i++)
    {
      this.addScene(this.data.scenes[i].Name,new GameScene(),this.data.scenes[i]);
    }

    //Add cutscenes
    length=this.data.cutscenes.length;
    for(i=0;i<length;i++)
    {
      this.addCutscene(this.data.cutscenes[i].Name,new CutScene(),this.data.cutscenes[i]);
    }

    //Puzzles
    length=this.data.puzzles.length;
    for(i=0;i<length;i++)
    {
      this.addPuzzle(this.data.puzzles[i].Name,new Puzzle(),this.data.puzzles[i]);
    }

    //Add Inventory
    this.addInventory();

    //Add text field
    this.addTextField();

    //Add player
    this.addPlayer();

    //Check if there is a saved game
    this.storage.check();

    //Set Title as the first scene to show
    this.setScene("Title");

    //Game's loop
    this.app.ticker.add(this.loop.bind(this));
  }

  loop(dt){
  //  console.log(this.player.lock) //Test
    //console.log(this.activeObject); //Test
    // update current state
    if (this.activeState != null) {
        this.activeState.update(dt);
    }
  }

  addObject(name, object, config) {
      this.objects[name] = object;

      //Config the object
      object.config=config;

      //Set game so object can access it
      object.game = this;

      //Build object
      object.build();
  }

  addScene(name, scene, config) {
      this.scenes[name] = scene;

      //Config the scene
      scene.setup(config);

      //Set game so scene can access it
      scene.game = this;

      //Build scene
      scene.build();
  }

  addCutscene(name, cutscene, config) {
      this.cutscenes[name] = cutscene;

      //Config the scene
      cutscene.config=config;

      //Set game so scene can access it
      cutscene.game = this;

      //Build scene
      cutscene.build();
  }

  addPuzzle(name, puzzle, config) {
      this.puzzles[name] = puzzle;

      //Puzzle's config
      puzzle.config=config;

      //Set game so puzzle can access it
      puzzle.game = this;
  }

  setScene(name,playerCoords) {

      //Remove current container
      if (this.activeScene !== null) {
          this.app.stage.removeChild(this.activeScene.container);
      }

      //Set current container
      this.activeScene = this.scenes[name];
      //Add our new container
      this.app.stage.addChild(this.activeScene.container);

      if(playerCoords!==undefined){
        this.player.sprite.x=playerCoords[0];
        this.player.sprite.y=playerCoords[1];
      }

      if(this.activeScene.config.Player!==undefined){
        if(this.activeScene.config.Player.Position!==undefined){
          this.player.position(this.activeScene.config.Player.Position);
        }
        if(this.activeScene.config.Player.Size!==undefined){
          this.player.size=this.activeScene.config.Player.Size;
          this.player.scale();
        }
      }

      if(this.activeScene.config.CutScene!==undefined){
        if(!this.cutscenes[this.activeScene.config.CutScene].played){
          this.cutscenes[this.activeScene.config.CutScene].show();
        }
      }else{
        // Play sounds
        if(this.activeScene.music!==undefined && this.playSounds){
          PIXI.sound.stopAll();
          if(PIXI.sound.exists(this.activeScene.music))
            PIXI.sound.play(this.activeScene.music,{loop:true});
        }
      }

      //Save game progress
      if(this.activeScene!==this.scenes["Title"])
        this.storage.save();

  }

  addZOrder(){
    this.BottomGroup= new PIXI.display.Group(0,false);
    this.sortGroup= new PIXI.display.Group(1, true);
    this.sortGroup.on('sort', function (sprite) {
      sprite.zOrder = -sprite.y;
    });
    this.TopGroup = new PIXI.display.Group(2,false);
    this.UIGroup = new PIXI.display.Group(3,false);

    this.layerBottom=new PIXI.display.Layer(this.BottomGroup);
    this.layer=new PIXI.display.Layer(this.sortGroup);
    this.layerTop=new PIXI.display.Layer(this.TopGroup);
    this.layerUI=new PIXI.display.Layer(this.UIGroup);

    this.app.stage.group.enableSort = true;
    this.app.stage.addChild(this.layerBottom);//Z-order
    this.app.stage.addChild(this.layer);//Z-order
    this.app.stage.addChild(this.layerTop);//Z-order
    this.app.stage.addChild(this.layerUI);//Z-order
  }

  addInventory(){
    this.inventory=new Inventory();
    this.inventory.game=this;
    this.inventory.build();
  }

  addPlayer(){
    this.player=new Player();
    this.player.game=this;
    this.data.player.Name="player";
    this.player.setup(this.data.player);
    this.player.build();
  }

  addNPC(name, char, config){
    this.npcs[name] = char;

    char.game = this;

    char.setup(config);

    char.build();
  }

  addDialogue(name, dialogue, config){
    this.dialogues[name] = dialogue;

    dialogue.game = this;

    dialogue.setup(config);
  }

  addTextField(){
    this.textField=new TextField();
    this.textField.game=this;
    this.textField.build();
  }

  //Adjust game screen to the window
  resize() {
    var w = window.innerWidth;// * window.devicePixelRatio;
    var h = window.innerHeight;// * window.devicePixelRatio;
    var ratio = Math.min( w/this.width,  h/this.height);
    this.app.renderer.resize(this.width*ratio,this.height*ratio);
    this.app.stage.scale.set(ratio);

  }

  //The magic begins
  start(){
    //Show Inventory
    this.app.stage.addChild(this.inventory.container);
    this.app.stage.addChild(this.inventory.icon);

    //Show Player
    this.app.stage.addChild(this.player.sprite);

    //Add Text Field
    this.app.stage.addChild(this.textField.container);
  }


}

export default Game;
