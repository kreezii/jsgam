import {gameScene} from './scenes.js';
import {Player} from './player.js';

export var game={
  version:"5.0 pre-alpha",
  //loadingText:{},
  width:0,
  height:0,
  resources:{},
  player:{},
  scenesConfig:[],
  scenes:[],
  objects:[],
  currentScene:0,
  selectedObject:{},
  playerTween:{},
  ticker:{},
  gameFiles:[],
  main:function(){},
  loop:function(){},
  create:function(width,height,objectID){
    this.app=new PIXI.Application(width,height);
    this.width=width;
    this.height=height;
    this.loadingText=new PIXI.Text("0 %", {
          fontFamily: 'Arial',
          fontSize: 35,
          fill: 'white',
          align: 'left'
    });

    if(!objectID) document.body.appendChild(this.app.view);
    else document.getElementById(objectID).appendChild(this.app.view);

  },

  addResource:function(name,resource){
    this.gameFiles.push(name);
    PIXI.loader.add(name,resource);
  },

  load:function(){
      this.loadingText.anchor.set(0.5);
      this.loadingText.x=this.app.screen.width/2;
      this.loadingText.y=this.app.screen.height/2;
      this.app.stage.addChild(this.loadingText);
      PIXI.loader.onProgress.add(() => {
        let percent=Math.floor(PIXI.loader.progress);
        this.loadingText.text=percent+ "%";
        console.log(percent);}
      );

      PIXI.loader.load((loader, resources) => {
//EDITED========================
      this.loadingText.visible=false;
      for(let i=0;i<this.gameFiles.length;i++){
        if(resources[this.gameFiles[i]].data.Scenes){
        let tempArray=this.scenesConfig.concat(resources[this.gameFiles[i]].data.Scenes);
        this.scenesConfig=tempArray;
        }
      }
//EDITED========================

      PIXI.loader.reset();

      PIXI.loader.add('menuLook', 'data/imgs/UI/look.png')
      .add('menuTake','data/imgs/UI/take.png')
      .add('menuUse','data/imgs/UI/use.png')
      .add('playerTex', resources["player"].data.Player.Texture)
      .add('playerJson', resources["player"].data.Player.Json)
      .add('playerSkeleton', resources["player"].data.Player.Skeleton);

      this.loadingText.visible=true;
      PIXI.loader.onProgress.add(this.loadingProgress);
      //Scenes
      for(let i=0;i<this.scenesConfig.length;i++){
        //Scenes+=arrayScene[i];
        let tmpTexture=this.scenesConfig[i].Background;
        let tmpSound=this.scenesConfig[i].Music;
        if(tmpTexture!="")PIXI.loader.add(this.scenesConfig[i].Name+"Texture",tmpTexture);
        if(tmpSound!="") PIXI.loader.add(this.scenesConfig[i].Name+"Sound",tmpSound);
        //Objects
        for(let j=0;j<this.scenesConfig[i].Objects.length;j++){
          PIXI.loader.add(this.scenesConfig[i].Objects[j].Name+"Texture",this.scenesConfig[i].Objects[j].Texture);
        }
      }
      PIXI.loader.load((loader, resources) => {
        this.resources=resources;
        this.run();
      });
  });
},

  loadingProgress:function(){

  },

  run:function(){
    this.loadingText.destroy();
  /*  this.scenes[0]=new gameScene(this.scenesConfig[0].Name,0);
    this.scenes[0].container.visible=true;
    this.app.stage.addChild(this.scenes[0].container);*/
    //Scenes
    for(let i=0;i<this.scenesConfig.length;i++){
      this.scenes[i]=new gameScene(this.scenesConfig[i].Name,i);
      this.app.stage.addChild(this.scenes[i].container);
    }
    this.scenes[0].container.visible=true;
  /*  menu=new buildMenu();*/
this.player=new Player();
    //player.animation.play("stand");
    //player.visible=true;
  /*  this.ticker=new PIXI.ticker.Ticker();
    this.ticker.add(deltaTime=>this.loop(deltaTime));
    this.ticker.start();*/
  this.main();
  },
  buildMenu:function(){
      let iconSize=50;
      let iconPos=[];
      for(let i=0;i<3;i++){
        iconPos[i]=i*iconSize;
      }
      this.container=new PIXI.Container();

      this.look=new iconMenu(resources.menuLook.texture,iconSize,iconPos[0]);
      this.take=new iconMenu(resources.menuTake.texture,iconSize,iconPos[1]);
      this.use=new iconMenu(resources.menuUse.texture,iconSize,iconPos[2]);

      this.container.visible=false;

      this.container.addChild(this.look.sprite);
      this.container.addChild(this.take.sprite);
      this.container.addChild(this.use.sprite);
      app.stage.addChild(this.container);

      this.look.sprite.on('pointerdown',_look);
      this.take.sprite.on('pointerdown',_take);
      this.use.sprite.on('pointerdown',_use);

      return this;
    }
};
