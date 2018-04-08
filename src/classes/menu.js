import {game} from '../game.js';

export class Menu{
    constructor(){
      let iconSize=50;
      let iconPos=[];
      for(let i=0;i<3;i++){
        iconPos[i]=i*iconSize;
      }
      this.container=new PIXI.Container();

      this.look=new iconMenu(PIXI.Texture.fromFrame("look.png"),iconSize,iconPos[0]);
      this.take=new iconMenu(PIXI.Texture.fromFrame("take.png"),iconSize,iconPos[1]);
      this.use=new iconMenu(PIXI.Texture.fromFrame("use.png"),iconSize,iconPos[2]);

      this.container.visible=false;

      this.container.addChild(this.look.sprite);
      this.container.addChild(this.take.sprite);
      this.container.addChild(this.use.sprite);

      this.look.sprite.on('pointerdown',look);
      this.take.sprite.on('pointerdown',take);
      this.use.sprite.on('pointerdown',use);
    }
};
class iconMenu{
  constructor(texture,size,pos){
    this.sprite=new PIXI.Sprite(texture);
    this.sprite.width=size;
    this.sprite.height=size;
    this.sprite.interactive=true;
    this.sprite.buttonMode=true;
    this.sprite.x=pos;
    this.sprite.parentLayer = game.layerUI;
  }
};

function showMenu(){
  game.menu.container.x=game.selectedObject.sprite.x;
  game.menu.container.y=game.selectedObject.sprite.y-50;
  game.menu.container.visible=true;
}

function look(){
  console.log(game.selectedObject.description);
}

function take(){
  console.log("Take this");
}

function use(){
  console.log("Use this");
}
