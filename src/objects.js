import {game} from './core.js';

export class gameObject{
  constructor(objectName,description,pos,interactive,type){
      this.name=objectName;
      this.description=description;
      this.sprite=new PIXI.Sprite(game.resources[objectName+"Texture"].texture);
      this.sprite.x=pos[0];
      this.sprite.y=pos[1];
      if(interactive){
        this.sprite.interactive=interactive;
        this.sprite.buttonMode=true;
     }
      //console.log(kind);
      if(type[0]=="door") this.sprite.on('pointerup', function(){_goScene(type[1])});
      else if(type[0]=="menu"){
        let thisObject=this;
        this.sprite.on('pointerdown',function(){game.selectedObject=thisObject; _showMenu()});
      }
    };
};
function _goScene(sceneName){

  let nextScene=_searchScene(sceneName);
  game.scenes[game.currentScene].container.visible=false;
  nextScene.container.visible=true;
  game.currentScene=nextScene.index;
}

function _searchScene(nameScene){
  let numberScene;


  for(let i=0;i<game.scenes.length;i++){
    if(nameScene==game.scenes[i].name){
      numberScene=i;
      break;
    }
  }
  return game.scenes[numberScene];
}
