import {game} from '../game.js';
import {gameObject} from './objects.js';
var Walkable=require('walkable');

export class gameScene{
  constructor(data,index){
    this.data=data;
    this.index=index;
    this.container=new PIXI.Container();
    this.container.visible=false;
    this.background=new PIXI.Sprite(PIXI.Texture.fromFrame(data.Background));
    this.background.width=game.app.screen.width;
    this.background.height=game.app.screen.height;
    this.background.parentLayer = game.layer;//Z-order

    if(data.Player){
      this.background.interactive=true;
      this.background.buttonMode=true;
      this.background.on('pointerup',movePlayer);

      this.walkable=new Walkable(game.app.screen.width,game.app.screen.height);
      if(data.WalkArea!=undefined){
        this.walkable.addPolygon(data.WalkArea);
      }

      if(data.Obstacles!=undefined){
        let obstacles=Object.values(data.Obstacles);
        this.data.Obstacles=obstacles;
        for(let i=0;i<this.data.Obstacles.length;i++){
          this.walkable.addPolygon(this.data.Obstacles[i]);
        }
      }
    }

    this.container.addChild(this.background);

    let sceneObjects=data.Objects;
    if(sceneObjects){
      for(let i=0;i<sceneObjects.length;i++){
        let objectIndex=game.searchObject(sceneObjects[i]);
        if(objectIndex!=undefined){
          this.container.addChild(game.objects[objectIndex]);
        }
      }
    }

    let sceneCharacters=data.Characters;
    if(sceneCharacters){
      for(let i=0;i<sceneCharacters.length;i++){
        let characterIndex=game.searchCharacter(sceneCharacters[i]);
        if(characterIndex!=undefined){
          this.container.addChild(game.characters[characterIndex].sprite);
        }
      }
    }

  }

  getPath(fromX,fromY,toX,toY){
    return this.walkable.findPath(fromX, fromY, toX, toY, 0);
  }
};

export class LogoScreen{
  constructor(){
    this.container=new PIXI.Container();
    this.container.visible=false;
    this.logo=new PIXI.Sprite(PIXI.Texture.fromFrame(game.settings.Logo));
    this.logo.anchor.set(0.5);
    this.logo.x=game.app.screen.width/2;
    this.logo.y=game.app.screen.height/2;
    this.container.addChild(this.logo);
    game.app.stage.addChild(this.container);
  }
}

export class TitleScreen{
  constructor(){
    this.container=new PIXI.Container();
    this.container.visible=false;
    this.optionsContainer=new PIXI.Container();
    this.newGame=new PIXI.Text("0 %", {
          fontFamily: 'Arial',
          fontSize: 35,
          fill: 'white',
          align: 'left'
    });
    this.continue=new PIXI.Text("0 %", {
          fontFamily: 'Arial',
          fontSize: 35,
          fill: 'white',
          align: 'left'
    });
    this.options=new PIXI.Text("0 %", {
          fontFamily: 'Arial',
          fontSize: 35,
          fill: 'white',
          align: 'left'
    });

    this.container.addChild(this.newGame);
    this.container.addChild(this.continue);
    this.container.addChild(this.options);

    game.app.stage.addChild(this.container);
    game.app.stage.addChild(this.optionsContainer);
  }
}

function movePlayer(event){
    game.player.action=null;
    game.selectedObject=null;
    game.player.move(event.data.getLocalPosition(game.app.stage));
}
