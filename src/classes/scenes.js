import {game,movePlayer} from '../game.js';
import {gameObject} from './objects.js';

export class gameScene{
  constructor(sceneName,index){
    let background=sceneName+"texture";
    this.name=sceneName;
    this.index=index;
  //  this.objects=[];
    this.container=new PIXI.Container();
    this.container.visible=false;
    this.background=new PIXI.Sprite(game.resources[sceneName+"Texture"].texture);
    this.background.width=game.app.renderer.width;
    this.background.height=game.app.renderer.height;
    this.background.parentLayer = game.layer;//Z-order
    if(game.scenesJSON[index].Player){
      this.background.interactive=true;
      this.background.on('pointerup',movePlayer);
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
};
