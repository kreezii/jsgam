import * as PIXI from 'pixi.js';
window.PIXI=PIXI; //Solution to use pixi-layers with PIXI v5
require("pixi-layers");

import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

// register the plugin
gsap.registerPlugin(PixiPlugin,MotionPathPlugin);

// give the plugin a reference to the PIXI object
PixiPlugin.registerPIXI(PIXI);

import GameLoader from './loader.js';
import Particles from './particles.js';
import Filters from './filters.js';
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
import Partner from './class/partner.js';
import NPC from './class/npc.js';
import Dialogue from './class/dialogue.js';
import Logo from './class/logo.js';
import Options from './class/options.js';
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
    this.gameContainer=document.getElementById(config.container);
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

    if(config.fitToContainer!==undefined) this.fitToContainer();

    //Disable contextmenu for mouse interaction
    document.addEventListener('contextmenu', e => {
       e.preventDefault();
    });

    //Append it to a HTML element
    this.gameContainer.appendChild(this.app.view)

    if(config.muteSound) this.playSounds = false;

    //Load config files
    this.preload(config.files);
  }

  //Read JSON configuration files
  preload(files){
    //Loading bar
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
    this.options=null;
    this.partner=null;

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

    this.movingState=null;

    this.finished=false;

    this.storage=new Storage(this);
    if(this.settings.Logos!==undefined) this.logo=new Logo(this);

    //Initialize particles and filter systems
    this.particles=new Particles(this);
    this.filters=new Filters(this);

    this.titleLabel="Title";

    if(this.settings.HoldTime!==undefined) this.holdTime=this.settings.HoldTime*1000;
    if(this.settings.dialogueChoices!==undefined) this.dialogueChoices=this.settings.dialogueChoices;
    else this.dialogueChoices=3;


    //Setup title screen
    this.addTitle();

    //Add sounds,music and voices
    this.addAudio(this.data.music,this.data.sounds,this.data.voices);

    //Add game objects
    this.addObjects(this.data.objects);

    //Non-playable characters
    this.addNPC(this.data.npc);

    //Dialogues
    this.addDialogues(this.data.dialogues);

    //Add game scenes
    this.addScenes(this.data.scenes);

    //Add cutscenes
    this.addCutscenes(this.data.cutscenes);

    //Puzzles
    this.addPuzzles(this.data.puzzles);

    //Add Inventory
    this.addInventory();

    //Add text field
    this.addTextField();

    //Add player
    this.addPlayer();

    //Add partner
    if(this.data.partner) this.addPartner();

    //Add Options if they are defined
    if(this.settings.Options!==undefined) this.addOptions();

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
      if(this.options!==null){
        this.app.stage.addChild(this.options.icon);
        this.app.stage.addChild(this.options.container);
      }
    }

  }

  loop(dt){
    // update current state
    if (this.movingState != null) {
        this.movingState.update(dt);
    }
    if(this.particles.emitter!=null) this.particles.update();
    if(this.filters.filter!=null) this.filters.update();
  }

  addTitle(){
    this.scenes[this.titleLabel]=new Title(this);
    this.scenes[this.titleLabel].setup(this.settings.TitleScreen);
    this.scenes[this.titleLabel].build();
  }

  addAudio(music,sounds,voices){
    if(music!==undefined){
      music.forEach((element, index) => {
        this.music[element.Name]=new Sound(this);
        this.music[element.Name].config=element;
        this.music[element.Name].source=this.files.resources[element.Name].sound;
        this.music[element.Name].source._loop=true;
      });
    }

    if(sounds!==undefined){
      sounds.forEach((element, index) => {
        this.sounds[element.Name]=new Sound(this);
        this.sounds[element.Name].config=element;
        this.sounds[element.Name].source=this.files.resources[element.Name].sound;
        if(element.Sprites){
          let audioSprite = Object.assign({}, ...element.Sprites.map(object => ({[object.key]: object.value})));
          this.sounds[element.Name].source._sprite=audioSprite;
        }
      });
    }

    if(voices!==undefined){
      voices.forEach((element, index) => {
        this.voices[element.Name]=new Sound(this);
        this.voices[element.Name].config=element;
        this.voices[element.Name].source=this.files.resources[element.Name].sound;
        this.voices[element.Name].source._sprite=element.Sprites;
      });
    }
  }

  addObjects(objects) {
    objects.forEach((element, index) => {
      this.objects[element.Name]=new GameObject(this);
      this.objects[element.Name].config=element;
      this.objects[element.Name].build();
    });
  }

  addScenes(scenes) {
    scenes.forEach((element, index) => {
      this.scenes[element.Name]=new GameScene(this);
      this.scenes[element.Name].config=element;
      this.scenes[element.Name].setup(element);
      this.scenes[element.Name].build();
    });
  }

  addCutscenes(cutscenes) {
    cutscenes.forEach((element, index) => {
      this.cutscenes[element.Name]=new CutScene(this);
      this.cutscenes[element.Name].config=element;
      this.cutscenes[element.Name].build();
    });
  }

  addPuzzles(puzzles) {
    puzzles.forEach((element, index) => {
      this.puzzles[element.Name]=new Puzzle(this);
      this.puzzles[element.Name].config=element;
    });
  }

  addNPC(charas){
    charas.forEach((element, index) => {
      this.npcs[element.Name]=new NPC(this);
      this.npcs[element.Name].config=element;
      this.npcs[element.Name].setup(element);
      this.npcs[element.Name].build();
    });
  }

  addDialogues(dialogues){
    dialogues.forEach((element, index) => {
      this.dialogues[element.Name]=new Dialogue(this);
      this.dialogues[element.Name].setup(element);
    });
  }

  addZOrder(){
    this.BottomGroup= new PIXI.display.Group(0,false);
    this.sortGroup= new PIXI.display.Group(1, true);
    this.sortGroup.on('sort', function (sprite) {
      sprite.zOrder =  sprite.y;
    });
    this.TopGroup = new PIXI.display.Group(2,false);
    this.UIGroup = new PIXI.display.Group(3,false);
    this.BlackGroup = new PIXI.display.Group(4,false);

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

  addOptions(){
    this.options=new Options();
    this.options.game=this;
    this.options.build();
  }

  addPlayer(){
    this.player=new Player(this);
    this.data.player.Name="player";
    this.player.setup(this.data.player);
  }

  addPartner(){
    this.partner=new Partner(this);
    this.partner.config=this.data.partner;
    this.data.partner.Name="partner";
    this.partner.setup(this.data.partner);
    this.partner.build();
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

  //Adjust game screen to container
  fitToContainer() {
    let canvas=this.app.view;
    canvas.style.width='100%';
    canvas.style.height='100%';
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  fullscreen(){
    if (this.gameContainer.requestFullscreen) {
        this.gameContainer.requestFullscreen();
      } else if (this.gameContainer.mozRequestFullScreen) { /* Firefox */
        this.gameContainer.mozRequestFullScreen();
      } else if (this.gameContainer.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        this.gameContainer.webkitRequestFullscreen();
      } else if (this.gameContainer.msRequestFullscreen) { /* IE/Edge */
        this.gameContainer.msRequestFullscreen();
      }
      if(!this.app.renderer.autoResize) this.resize();
  }

  //The magic begins
  start(){
    //Show Inventory
    this.app.stage.addChild(this.inventory.container);
    this.app.stage.addChild(this.inventory.icon);

    //Show Player
    this.app.stage.addChild(this.player.sprite);

    //Add partner if exists
    if(this.partner!=null) this.app.stage.addChild(this.partner.sprite);

    //Add Text Field
    this.app.stage.addChild(this.textField.container);
  }

  pause(){
    this.player.lock=true;
    this.activeScene.hide();
    this.inventory.hide();
    this.inventory.hideIcon();
    if(this.options!==null){
      this.options.hide();
      this.options.hideIcon();
    }
    this.player.hide();
    if(this.partner!=null) this.partner.hide();
    if(this.activeScene.music!==undefined){
      this.music[this.activeScene.music].stop();
    }
  }

  resume(){
    this.inventory.showIcon();
    if(this.options!==null){
      this.options.showIcon();
    }
    if(this.activeScene.config.Partner!==undefined){
      if(this.partner!==null) //addPartner();
      this.partner.show();
    }else this.partner.hide();
    this.player.show();
    this.player.unlock();
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

    //Particles and filters systems
    if(this.particles.emitter!=null) this.particles.stop();

    if(this.activeScene.config.Particles!==undefined){
      this.particles.start(this.activeScene.config.Particles);
    }

    if(this.filters.filter!=null) this.filters.stop();
    if(this.activeScene.config.Filter!==undefined){
      this.filters.start(this.activeScene.config.Filter);
    }

    //Save game progress
    if(this.activeScene!==this.scenes[this.titleLabel])
      this.storage.save();
  }

  changeScene(name,playerCoords){
    //Stop the current music playing
    if(this.activeScene.music!==undefined){
      this.music[this.activeScene.music].stop();
    }

    this.app.stage.addChild(this.blackScreen);
    if(this.tween) this.tween.kill();
    this.tween=gsap.set(this.blackScreen, {alpha:0});
    this.tween=gsap.fromTo(this.blackScreen,
      {alpha:0},
      {duration:1,alpha:1, onComplete:this.fadeOutEnd.bind(this),
        onCompleteParams:[name,playerCoords]});
  }

  fadeIn(){
    //Add our new container
    this.app.stage.addChild(this.activeScene.container);

    this.app.stage.addChild(this.blackScreen);

    if(this.tween) this.tween.kill();

    this.tween=gsap.set(this.blackScreen, {alpha:1});
    this.tween=gsap.fromTo(this.blackScreen,
      {alpha:1},
      {duration:1,alpha:0, onComplete:this.fadeInEnd.bind(this)}
    );
  }

  fadeInEnd(){
    this.app.stage.removeChild(this.blackScreen);

    //Play music if there is one to play
    if(this.activeScene.music!==undefined){
      this.music[this.activeScene.music].play(true);
    }
  }

  fadeOutEnd(name,playerCoords){
    this.setScene(name,playerCoords);
    //Check Cutscenes
    if(this.activeScene.config.CutScene!==undefined &&
      !this.cutscenes[this.activeScene.config.CutScene].played){
        this.activeCutscene=this.cutscenes[this.activeScene.config.CutScene];
        this.pause();
        this.activeCutscene.show();
    }else{
      this.resume();
    }
    this.player.scale();
    this.app.stage.removeChild(this.blackScreen);
  }
}

export default Game;
