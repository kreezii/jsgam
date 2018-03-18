import {game} from './core.js';
import {gameObject} from './objects.js';

export class gameScene{
  constructor(sceneName,index){
    let background=sceneName+"texture";
    this.name=sceneName;
    this.index=index;
    this.objects=[];
    this.container=new PIXI.Container();
    this.container.visible=false;
    this.background=new PIXI.Sprite(game.resources[sceneName+"Texture"].texture);
    this.background.width=game.app.renderer.width;
    this.background.height=game.app.renderer.height;
    if(game.scenesConfig[index].Walk){
      this.background.interactive=true;
      this.background.on('pointerup',movePlayer);
    }

    this.container.addChild(this.background);

    let sceneObjects=game.scenesConfig[index].Objects;

    for(let i=0;i<sceneObjects.length;i++){
      this.objects[i]=new gameObject(sceneObjects[i].Name,
      sceneObjects[i].Description,
      sceneObjects[i].Position,
      sceneObjects[i].Interactive,
      sceneObjects[i].Type
      );
      this.container.addChild(this.objects[i].sprite);
    }

  }
};
