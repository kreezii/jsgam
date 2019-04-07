import {game} from '../game.js';
import Walkable from 'walkable';

export class Scene{
  constructor(data){
    this.data=data;
    this.container=new PIXI.Container();
    this.container.visible=false;
    this.background=new PIXI.Sprite(PIXI.Texture.from(data.Background));
    this.background.width=game.width;
    this.background.height=game.height;
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
    if(this.data.Music!=undefined) PIXI.sound.stop(this.data.Music);
    this.container.visible=false;
  }

  show(){
    if(this.data.Music!=undefined) PIXI.sound.play(this.data.Music,{loop:true});
    this.container.visible=true;
    if(this.data.Player && game.player.sprite.visible==false) game.player.show();
    if(game.inventory.icon.visible==false) game.inventory.showIcon();
    if(this.data.Filters){
      game.layer.filters = game.checkFilters();
    }else{
      game.layer.filters = [];
    }
  }

  getPath(fromX,fromY,toX,toY){
    return this.walkable.findPath(fromX, fromY, toX, toY, 0);
  }

};

function movePlayer(event){
  //If the player isn't busy doing another thing
  if(!game.player.lock){
    game.inventory.hide();
    game.textField.hide();
    game.player.action=null;
    game.selectedObject=null;
    game.selectedCharacter=null;
    game.currentPuzzle=null;
    game.player.move(event.data.getLocalPosition(game.app.stage));
  }else if(!game.player.tween.active){
    //If user click (touches) on the screen we can skip the player or npc texts (for impatient people)
    if(game.timeout!=null) game.timeout.finish();
    if(game.currentDialogue!=null) game.currentDialogue.timeout.finish();
  }
}
