import {game} from '../game.js';

export class Inventory{
  constructor(){
      this.container=new PIXI.Container();
      this.container.visible=false;
      this.objects=[];
      this.background=new PIXI.Sprite(PIXI.Texture.fromFrame(game.inventoryBack));
      this.background.width=game.app.screen.width/2;
      this.background.height=game.app.screen.height/2;
      this.background.parentLayer = game.layerUI;
      this.container.x = (game.app.screen.width - this.background.width) / 2;
      this.container.y = (game.app.screen.height - this.background.height) / 2;
      this.icon=new PIXI.Sprite(PIXI.Texture.fromFrame(game.inventoryIcon));
      this.icon.x=game.app.screen.width - this.icon.width;
      this.icon.y=game.app.screen.height - this.icon.height;
      this.icon.interactive=true;
      this.icon.buttonMode=true;
      this.icon.parentLayer = game.layerUI;
      this.icon.on('pointerup',showHide);
      this.container.addChild(this.background);
    }
};

function showHide(){
  game.showInventory();
}
