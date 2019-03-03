import {game} from '../game.js';
var Walkable=require('walkable');

export class gameScene{
  constructor(data,index){
    this.data=data;
    this.index=index;
    this.container=new PIXI.Container();
    this.container.visible=false;
    this.background=new PIXI.Sprite(PIXI.Texture.fromFrame(data.Background));
    //this.background.width=game.app.screen.width;
    //this.background.height=game.app.screen.height;
    this.background.parentLayer = game.layer;//Z-order
    if(data.Player){
      this.background.interactive=true;
      this.background.buttonMode=true;
      this.background.on('pointertap',movePlayer);

    //  this.walkable=new Walkable(game.app.screen.width,game.app.screen.height);
    this.walkable=new Walkable(game.width,game.height);
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

  hide(){
      this.container.visible=false;
  }

  show(){
      this.container.visible=true;
  }
  getPath(fromX,fromY,toX,toY){
    return this.walkable.findPath(fromX, fromY, toX, toY, 0);
  }
};

function movePlayer(event){
  if(!game.player.lock){
    game.player.action=null;
    game.selectedObject=null;
    game.selectedCharacter=null;
    game.player.move(event.data.getLocalPosition(game.app.stage));
  }
}
