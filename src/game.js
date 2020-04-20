import * as PIXI from 'pixi.js';
window.PIXI=PIXI; //Solution to use pixi-layers with PIXI v5
require("pixi-layers");

import { TweenMax } from "gsap";
import PixiPlugin from "gsap/PixiPlugin";
PixiPlugin.registerPIXI(PIXI);

import GameLoader from './loader.js';
import Storage from './storage.js';
import Sound from './sound.js';
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
import Logo from './class/logo.js';
import ProgressBar from './class/progressbar.js';

class Game {
  constructor(config){
    this.settings={};
    this.data={
      scenes:[],
      cutscenes:[],
      objects:[],
      dialogues:[],
      puzzles:[],
      texts:[],
      music:[],
      npc:[],
      voices:[],
      sounds:[]
    };
    this.width=config.width;
    this.height=config.height;
    this.holdTime=500;
    this.playSounds = true;
    this.musicPlaying=null;

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
  /*  this.progressBar=new PIXI.Graphics();
    this.progressBar.beginFill(0xDE3249);
    this.progressBar.drawRect(0, 0, this.width, this.height/50);
    this.progressBar.endFill();
    this.progressBar.width=0;
*/
    this.progressBar=new ProgressBar(this);

    this.loadingTxt=new PIXI.Text("Loading...", {fill: 'white',"fontSize": 50});
    this.loadingTxt.anchor.set(0.5);
    this.loadingTxt.x=this.width/2;
    this.loadingTxt.y=this.height/2;

    this.progressBar.container.y=this.loadingTxt.y+this.loadingTxt.height;
    this.progressBar.container.x=this.width/2-this.progressBar.container.width/2;

    this.app.stage.addChild(this.loadingTxt);
    this.app.stage.addChild(this.progressBar.container);
    this.resize();
    this.jsons=new GameLoader();
    this.jsons.game=this;
    this.jsons.addJSON(files);
    this.jsons.load(this.load.bind(this)); //When all config files are loaded, load the game resources.
  }

  //Load game resources (images,sounds,vids...)
  load(){
    this.files=new GameLoader();
    this.files.game=this;
    this.files.addFiles(Object.values(this.jsons.resources));
    this.files.load(this.setup.bind(this));
  }

  setup(){
    this.app.stage.removeChild(this.loadingTxt);
    this.app.stage.removeChild(this.progressBar.container);

    //Z-Order
    this.addZOrder();

    //Adjust to window size
    this.resize();

    this.tween=null;
    this.logo=null;

    this.scenes={};
    this.cutscenes={};
    this.objects={};
    this.npcs={};
    this.dialogues={};
    this.puzzles={};
    this.music={};
    this.sounds={};
    this.voices={};


    this.activeLanguage=0;
    this.activeScene=null;
    this.activeObject=null;
    this.activeNPC=null;
    this.activePuzzle=null;
    this.activeDialogue=null;
    this.activeCutscene=null;
    this.activeVoice=null;

    this.activeState=null;

    this.finished=false;

    this.storage=new Storage(this);
    if(this.settings.Logos!==undefined) this.logo=new Logo(this);
  //  this.sound=new SoundManager(this);

    this.titleLabel="Title";


    if(this.settings.HoldTime!==undefined) this.holdTime=this.settings.HoldTime*1000;
    if(this.settings.dialogueChoices!==undefined) this.dialogueChoices=this.settings.dialogueChoices;
    else this.dialogueChoices=3;

    //Setup title screen
    this.addScene(this.titleLabel,new Title(),this.settings.TitleScreen);

    //Add sounds,music and voices
    let i;
    let length=this.data.music.length;
    for(i=0;i<length;i++)
    {
      this.addMusic(this.data.music[i].Name,new Sound(),this.data.music[i]);
    }

    length=this.data.sounds.length;
    for(i=0;i<length;i++)
    {
      this.addSound(this.data.sounds[i].Name,new Sound(),this.data.sounds[i]);
    }

    length=this.data.voices.length;
    for(i=0;i<length;i++)
    {
      this.addVoice(this.data.voices[i].Name,new Sound(),this.data.voices[i]);
    }


    //Add game objects
    length=this.data.objects.length;
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

    this.addBlackScreen();

    //Game's loop
    this.app.ticker.add(this.loop.bind(this));

    if(this.settings.Logos!==undefined) this.logo.show();
    else{
      //Set Title as the first scene to show
      this.setScene(this.titleLabel);
      this.fadeIn();
    }

  }

  loop(dt){
    // update current state
    if (this.activeState != null) {
        this.activeState.update(dt);
    }
  }

  addMusic(name, music, config) {
      this.music[name] = music;

      //Music parameters
      music.config=config;

      //Set game so music can access it
      music.game = this;

      music.source=this.files.resources[name].sound;
  }

  addSound(name, sound, config) {
      this.sounds[name] = sound;

      //Music parameters
      sound.config=config;

      //Set game so music can access it
      sound.game = this;

      sound.source=this.files.resources[name].sound;

      if(config.Sprites) sound.source._sprite=config.Sprites;
  }

  addVoice(name, voice, config) {
      this.voices[name] = voice;

      //Music parameters
      voice.config=config;

      //Set game so music can access it
      voice.game = this;

      voice.source=this.files.resources[name].sound;

      voice.source._sprite=config.Sprites;
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

  addZOrder(){
    this.BottomGroup= new PIXI.display.Group(0,false);
    this.sortGroup= new PIXI.display.Group(1, true);
    this.sortGroup.on('sort', function (sprite) {
      sprite.zOrder =  sprite.y;
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

  //Used for fade between screens
  addBlackScreen(){
    this.blackScreen=new PIXI.Sprite(PIXI.Texture.WHITE);
    this.blackScreen.width=this.width;
    this.blackScreen.height=this.height;
    this.blackScreen.tint=0x000000;
    this.blackScreen.parentLayer = this.layerUI;
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

  pause(){
    this.activeScene.hide();
    this.inventory.hide();
    this.inventory.hideIcon();
    this.player.hide();
    if(this.activeScene.music!==undefined){
      this.music[this.activeScene.music].stop();
    }
  }

  resume(){
    this.inventory.showIcon();
    this.player.show();
    this.activeScene.show();
    this.fadeIn();
  }

  end(){
    this.finished=true;
  }

  home(){
    location.reload();
  }

  setScene(name,playerCoords) {
    //Remove current container
    if (this.activeScene !== null) {
        this.app.stage.removeChild(this.activeScene.container);
    }

    //Set current container
    this.activeScene = this.scenes[name];

    //Player parameters
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
    //Save game progress
    if(this.activeScene!==this.scenes[this.titleLabel])
      this.storage.save();
  }

  changeScene(name,playerCoords){
    //Music
    if(this.activeScene!==undefined){
      //this.sound.stop(this.activeScene.music);
      if(this.musicPlaying!==null && this.scenes[name].music){
        this.music[this.musicPlaying].stop();
        this.musicPlaying=null;
      }
    }
    this.app.stage.addChild(this.blackScreen);
    if(this.tween) this.tween.kill();
    this.tween=TweenMax.set(this.blackScreen, {alpha:0});
    this.tween=TweenMax.fromTo(this.blackScreen, 1,
      {alpha:0},
      {alpha:1, onComplete:this.fadeOutEnd.bind(this),
        onCompleteParams:[name,playerCoords]});
  }

  fadeIn(){
    //Add our new container
    this.app.stage.addChild(this.activeScene.container);

    this.app.stage.addChild(this.blackScreen);

    if(this.tween) this.tween.kill();
    this.tween=TweenMax.set(this.blackScreen, {alpha:1});
    this.tween=TweenMax.fromTo(this.blackScreen, 1,
      {alpha:1},
      {alpha:0, onComplete:this.fadeInEnd.bind(this)}
    );
  }

  fadeInEnd(){
    this.app.stage.removeChild(this.blackScreen);
    //Music
    if(this.activeScene.music!==undefined && this.playSounds){
      //this.sound.play(this.activeScene.music);
      this.music[this.activeScene.music].play(true);
      this.musicPlaying=this.activeScene.music;
    }
  }

  fadeOutEnd(name,playerCoords){
    this.setScene(name,playerCoords);
    //Check Cutscenes
    if(this.activeScene.config.CutScene!==undefined &&
      !this.cutscenes[this.activeScene.config.CutScene].played){
        this.activeCutscene=this.cutscenes[this.activeScene.config.CutScene];
      //  this.pause();
        this.activeCutscene.show();
    }else{
      this.resume();
    }
    this.player.scale();
    this.app.stage.removeChild(this.blackScreen);
  }
}

export default Game;
