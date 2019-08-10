//import * as PIXI from 'pixi.js';
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
        this.walkable.addPolygon(this.config.WalkArea);
      }

      if(this.config.Obstacles!==undefined){
        let obstacles=Object.values(this.config.Obstacles);
        this.config.Obstacles=obstacles;
        for(let i=0;i<this.config.Obstacles.length;i++){
          this.walkable.addPolygon(this.config.Obstacles[i]);
        }
      }

      //Add objects to the scene
      let sceneObjects=this.config.Objects;
      if(sceneObjects){
        for(let i=0;i<sceneObjects.length;i++){
          if(this.game.objects[sceneObjects[i]]!==undefined){
            this.container.addChild(this.game.objects[sceneObjects[i]].sprite);
          }else{
            console.log("Error:Game object "+sceneObjects[i]+" not found");
          }
        }
      }

      //Add NPCs (non-playable characters) to the scene
      let sceneChars=this.config.Characters;
      if(sceneChars){
        for(let i=0;i<sceneChars.length;i++){
          if(this.game.npcs[sceneChars[i]]!==undefined){
            this.container.addChild(this.game.npcs[sceneChars[i]].sprite);
          }else{
            console.log("Error:Game character "+sceneChars[i]+" not found");
          }
        }
      }
  }

  getPosition(event){
    let coord=event.data.getLocalPosition(this.game.app.stage);
    if(!this.game.player.lock && this.game.activeObject===null && this.game.activeNPC===null){
      this.game.player.move(coord);
    }
  }

  getPath(fromX,fromY,toX,toY){
    return this.walkable.findPath(fromX, fromY, toX, toY, 0);
  }

}

export default GameScene;
