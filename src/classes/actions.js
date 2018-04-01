import {game} from '../game.js';

export class Menu{
    constructor(){
      let iconSize=50;
      let iconPos=[];
      for(let i=0;i<3;i++){
        iconPos[i]=i*iconSize;
      }
      this.container=new PIXI.Container();

      this.look=new iconMenu(resources.menuLook.texture,iconSize,iconPos[0]);
      this.take=new iconMenu(resources.menuTake.texture,iconSize,iconPos[1]);
      this.use=new iconMenu(resources.menuUse.texture,iconSize,iconPos[2]);

      this.container.visible=false;

      this.container.addChild(this.look.sprite);
      this.container.addChild(this.take.sprite);
      this.container.addChild(this.use.sprite);
      app.stage.addChild(this.container);

      this.look.sprite.on('pointerdown',_look);
      this.take.sprite.on('pointerdown',_take);
      this.use.sprite.on('pointerdown',_use);
    }
};
