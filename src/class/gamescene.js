//import * as PIXI from 'pixi.js';
import Scene from './scene.js';

import Walkable from 'walkable';

class GameScene extends Scene{
  build(){
    this.background.parentLayer = this.game.layer; //Z-order
    this.background.interactive=true;
    this.background.buttonMode=true;

    this.background.on('pointertap',this.getPosition.bind(this));

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
  }

  getPosition(event){
    let coord=event.data.getLocalPosition(this.game.app.stage);
    if(!this.game.player.lock){
      if(this.game.activeObject!==null) this.game.activeObject.cancel();
      this.game.player.move(coord);
    }
  }

  getPath(fromX,fromY,toX,toY){
    return this.walkable.findPath(fromX, fromY, toX, toY, 0);
  }

}

export default GameScene;
