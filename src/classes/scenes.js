import {game} from '../game.js';
import {gameObject} from './objects.js';
var Walkable=require('walkable');

export class gameScene{
  constructor(data,index){
    this.name=data.Name;
    this.index=index;
    this.music=data.Music;
    this.player=false;
    this.inventory=data.Inventory;
    this.container=new PIXI.Container();
    this.container.visible=false;
    this.background=new PIXI.Sprite(PIXI.Texture.fromFrame(data.Background));
    this.background.width=game.app.screen.width;
    this.background.height=game.app.screen.height;
    this.background.parentLayer = game.layer;//Z-order

    if(data.Player){

      this.player=true;
      this.playerSize=data.Player.Size;
      this.background.interactive=true;
      this.background.buttonMode=true;
      this.background.on('pointerup',movePlayer);

      this.walkable=new Walkable(game.app.screen.width,game.app.screen.height);
      if(game.scenesJSON[index].WalkArea!=undefined){
        this.walkArea=game.scenesJSON[index].WalkArea;
        this.walkable.addPolygon(this.walkArea);
      }

      if(game.scenesJSON[index].Obstacles!=undefined){
        this.obstacles=Object.values(game.scenesJSON[index].Obstacles);
        for(let i=0;i<this.obstacles.length;i++){
          this.walkable.addPolygon(this.obstacles[i]);
        }
      }
    }


    if(data.Inventory!=undefined){
      this.inventory=data.Inventory;
    }
    this.container.addChild(this.background);

    let sceneObjects=game.scenesJSON[index].Objects;
    if(sceneObjects){
      for(let i=0;i<sceneObjects.length;i++){
        let objectIndex=game.searchObject(sceneObjects[i]);
        if(objectIndex!=undefined){
          this.container.addChild(game.objects[objectIndex]);
        }
      }
    }

    let sceneCharacters=game.scenesJSON[index].Characters;
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

function movePlayer(event){
    game.player.action=null;
    game.selectedObject=null;
    game.player.lock=false;
    game.player.move(event.data.getLocalPosition(game.app.stage));
}
