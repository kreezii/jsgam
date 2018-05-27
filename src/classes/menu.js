import {game} from '../game.js';

export class Menu{
    constructor(){
      let iconSize=50;
      let iconPos=[];
      for(let i=0;i<3;i++){
        iconPos[i]=i*iconSize;
      }
      this.container=new PIXI.Container();

      this.look=new iconMenu(PIXI.Texture.fromFrame("menu-look.png"),iconSize,iconPos[0]);
      this.take=new iconMenu(PIXI.Texture.fromFrame("menu-take.png"),iconSize,iconPos[1]);
      this.use=new iconMenu(PIXI.Texture.fromFrame("menu-use.png"),iconSize,iconPos[2]);

      this.container.visible=false;

      this.container.addChild(this.look);
      this.container.addChild(this.take);
      this.container.addChild(this.use);

      this.look.on('pointerdown',look);
      this.take.on('pointerdown',take);
      this.use.on('pointerdown',use);
    }
};

class iconMenu extends PIXI.Sprite{
  constructor(texture,size,pos){
    super(texture);
    this.width=size;
    this.height=size;
    this.interactive=true;
    this.buttonMode=true;
    this.x=pos;
    this.parentLayer = game.layerUI;
  }
};

function look(){
  console.log(game.objects[game.selectedObject].description);
}

function take(){
  game.objects[game.selectedObject].take();
}

function use(){
  console.log("Use this");
}
