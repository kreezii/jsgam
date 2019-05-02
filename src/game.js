import * as PIXI from 'pixi.js';
import 'pixi-sound';
import 'pixi-layers';

import Loader from './loader.js';
import Title from './class/title.js';
import GameScene from './class/gamescene.js';
import GameObject from './class/gameobject.js';
import Inventory from './class/inventory.js';
import Puzzle from './class/puzzle.js';
import {TextField} from './class/text.js';
import Player from './class/player.js';

class Game {
  constructor(config){
    this.settings={};
    this.data={};
    this.width=config.width;
    this.height=config.height;
    this.playSounds = true;

    //Setup the application
    this.app = new PIXI.Application(config.width,config.height,{autoResize: true,resolution: devicePixelRatio});
    this.app.renderer.autoResize=true;
    this.app.stage = new PIXI.display.Stage();

    //Change game size when window size changes
    if(config.autoResize!==undefined) this.app.renderer.autoResize=config.autoResize;
    else window.addEventListener('resize', this.resize.bind(this));


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
    this.loadinProgress=new PIXI.Text("0 %", {fill: 'white',"fontSize": 50});
    this.loadinProgress.anchor.set(0.5);
    this.loadinProgress.x=this.width/2;
    this.loadinProgress.y=this.height/2;
    this.app.stage.addChild(this.loadinProgress);

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
    this.app.stage.removeChild(this.loadinProgress);

    //Z-Order
    this.addZOrder();

    //Adjust to window size
    this.resize();

    this.scenes={};
    this.objects={};
    this.puzzles=[];
    this.activeLanguage=0;
    this.activeScene=null;
    this.activeObject=null;
    this.activePuzzle=null;
    this.activeState=null;

    //Setup title screen
    this.addScene("Title",new Title(),this.settings.TitleScreen);

    //Add game objects
    let i;
    let length=this.data.objects.length;
    for(i=0;i<length;i++)
    {
      this.addObject(this.data.objects[i].Name,new GameObject(),this.data.objects[i]);
    }

    //Add game scenes
    length=this.data.scenes.length;
    for(i=0;i<length;i++)
    {
      this.addScene(this.data.scenes[i].Name,new GameScene(),this.data.scenes[i]);
    }

    //Set Title as the first scene to show
    this.setScene("Title");

    //Puzzles
    length=this.data.puzzles.length;
    for(i=0;i<length;i++)
    {
      this.addPuzzle(this.data.puzzles[i].Name,new Puzzle(),this.data.puzzles[i]);
    }

    //Add Inventory
    this.addInventory();

    //Add Inventory
    this.addTextField();

    //Add player
    this.addPlayer();

    //Game's loop
    this.app.ticker.add(this.loop.bind(this));
  }

  loop(dt){
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

  addPuzzle(name, puzzle, config) {
    this.puzzles.push(puzzle);
    puzzle.config=config;
    puzzle.game = this;
    /*  this.puzzles[name] = puzzle;

      //Puzzle's config
      puzzle.config=config;

      //Set game so puzzle can access it
      puzzle.game = this;*/
  }
//Comprobar los dos nombres
  getPuzzle(name1,name2){
    let found;
    for(let i=0;i<this.puzzles.length;i++){
      if(name1===this.puzzles[i].config.Target
        && name2===this.puzzles[i].config.Combine
        ||
        name2===this.puzzles[i].config.Target
        && name1===this.puzzles[i].config.Combine)
//         nameObject==this.puzzles[i].config.Give)
      {
          found=i;
           break;
      }
    }
    return found;
    //this.currentPuzzle=found;
  }

  setScene(name) {
      //Remove current container
      if (this.activeScene != null) {
          this.app.stage.removeChild(this.activeScene.container);
      }

      //Set current container
      this.activeScene = this.scenes[name];

      //Add our new container
      this.app.stage.addChild(this.activeScene.container);

      // Play sounds
    //  if(this.activeScreen.music!==null && this.playSounds) PIXI.sound.play(this.activeScreen.music,{loop:true});
  }

  addZOrder(){
    this.sortGroup= new PIXI.display.Group(0, true);
    this.sortGroup.on('sort', function (sprite) {
      sprite.zOrder = -sprite.y;
    });
    this.onTopGroup = new PIXI.display.Group(1,false);
    this.UIGroup = new PIXI.display.Group(2,false);

    this.layer=new PIXI.display.Layer(this.sortGroup);
    this.layeronTop=new PIXI.display.Layer(this.onTopGroup);
    this.layerUI=new PIXI.display.Layer(this.UIGroup);
    //this.layerUI.group.enableSort = true;
    //this.layer.group.enableSort = true;
    this.app.stage.group.enableSort = true;
    this.app.stage.addChild(this.layer);//Z-order
    this.app.stage.addChild(this.layeronTop);//Z-order
    this.app.stage.addChild(this.layerUI);//Z-order
  }

  addInventory(){
    this.inventory=new Inventory();
    this.inventory.game=this;
    this.inventory.build();
  }

  addPlayer(){
    let playerConfig={
      Skeleton:this.files.resources["playerSkeleton"].data,
      Json:this.files.resources["playerJson"].data,
      Texture:this.files.resources["playerTex"].texture,
      Armature:this.data.player.Armature,
      Animations:this.data.player.Animations,
      data:this.data.player
    }

    this.player=new Player();
    this.player.game=this;
    this.player.setup(playerConfig);
  }

  addTextField(){
    this.textField=new TextField();
    this.textField.game=this;
    this.textField.build();
  }

  //Adjust game screen to the window
  resize() {
    var w = window.innerWidth * window.devicePixelRatio;
    var h = window.innerHeight * window.devicePixelRatio;
    var ratio = Math.min( w/this.width,  h/this.height);
    this.app.renderer.resize(this.width*ratio,this.height*ratio);
    this.app.stage.scale.set(ratio);
  }

  //The magic begins
  start(){
    this.setScene(this.settings.FirstScene);

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
