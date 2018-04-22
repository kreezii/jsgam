import {game} from '../game.js';
import {gameObject} from './objects.js';
var Walkable=require('walkable');

export class gameScene{
  constructor(data,index){
    this.name=data.Name;
    this.index=index;
    this.music=data.Music;
    this.container=new PIXI.Container();
    this.container.visible=false;
    this.background=new PIXI.Sprite(PIXI.Texture.fromFrame(data.Background));
    this.background.width=game.app.renderer.width;
    this.background.height=game.app.renderer.height;
    this.background.parentLayer = game.layer;//Z-order

    if(game.scenesJSON[index].Player!=undefined){
      game.player.sprite.x=game.scenesJSON[index].Player[0];
      game.player.sprite.y=game.scenesJSON[index].Player[1];
      this.background.interactive=true;
      this.background.buttonMode=true;
      this.background.hitArea=new PIXI.Polygon(game.scenesJSON[index].WalkArea);
      this.background.on('pointerup',gotoXY);

      this.walkable=new Walkable(game.app.screen.width,game.app.screen.height);
      this.walkable.addPolygon(this.background.hitArea.points);
    }

    this.container.addChild(this.background);

    let sceneObjects=game.scenesJSON[index].Objects;
    for(let i=0;i<sceneObjects.length;i++){
      let objectIndex=game.searchObject(sceneObjects[i]);
      if(objectIndex!=undefined){
        this.container.addChild(game.objects[objectIndex].sprite);
      }
    }

  }

  getPath(fromX,fromY,toX,toY){
    return this.walkable.findPath(fromX, fromY, toX, toY, 1);
  }
};

function gotoXY(event){
  game.player.move(event);game.hideMenu();game.selectedObject=null;
}
