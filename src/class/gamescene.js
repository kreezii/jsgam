import Scene from './scene.js';

import Walkable from 'walkable';


class GameScene extends Scene{
  build(){
    if(this.foreground!==undefined) this.foreground.parentLayer = this.game.layerTop; //Z-order
    this.background.parentLayer = this.game.layerBottom; //Z-order
    this.background.interactive=true;
    this.background.buttonMode=true;

    this.background.on('pointertap',this.getPosition.bind(this));

    //Add obstacles to the scene
    this.walkable=new Walkable(this.game.width,this.game.height);
      if(this.config.WalkArea!==undefined){
        this.polyWalk=this.walkable.addPolygon(this.config.WalkArea);
      }

      if(this.config.Obstacles!==undefined){
        this.config.Obstacles=Object.values(this.config.Obstacles);
        this.config.Obstacles.forEach((element, index) => {
          this.walkable.addPolygon(element);
        });
      }

      //Add objects to the scene
      if(this.config.Objects){
        this.config.Objects.forEach((element, index) => {
          if(this.game.objects[element]!==undefined){
            this.container.addChild(this.game.objects[element].sprite);
          }else{
            console.log("Error:Game object "+element+" not found");
          }
        });
      }

      //Add NPCs (non-playable characters) to the scene
      if(this.config.Characters){
        this.config.Characters.forEach((element, index) => {
          if(this.game.npcs[element]!==undefined){
            this.container.addChild(this.game.npcs[element].sprite);
          }else{
            console.log("Error:Game character "+element+" not found");
          }
        });
      }
  }

  getPosition(event){
    let coord=event.data.getLocalPosition(this.game.app.stage);
    if(!this.game.player.lock/* && this.game.activeObject===null && this.game.activeNPC===null*/){
      this.game.player.move(coord);
    }
  }

  getPath(fromX,fromY,toX,toY){
    return this.walkable.findPath(fromX, fromY, toX, toY, 0);
  }

}

export default GameScene;
