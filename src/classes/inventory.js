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
      this.border=10;
      this.icon=new PIXI.Sprite(PIXI.Texture.fromFrame(game.inventoryIcon));
      this.icon.visible=false;
      this.icon.interactive=true;
      this.icon.buttonMode=true;
      this.icon.parentLayer = game.layerUI;
      this.icon.on('pointerup',showHide);
      this.container.addChild(this.background);
    }

    hide(){
      this.container.visible=false;
    }

    setIcon(position){
      //this.icon.visible=true;
      if(position=="bottom-right"){
        this.icon.x=game.app.screen.width - this.icon.width;
        this.icon.y=game.app.screen.height - this.icon.height;
      }else if(position=="top-right"){
        this.icon.x=game.app.screen.width - this.icon.width;
        this.icon.y=0;
      }
    }
    remove(nameObject)
    {
      this.objects.splice(this.searchObject(nameObject),1);
      this.update();
    }
    searchObject(nameObject){
      let numberObject;
      for(let i=0;i<this.objects.length;i++){
        if(nameObject==this.objects[i].name){

          numberObject=i;
          break;
        }
      }
      return numberObject;
    }

    update(){
      for(let i=0;i<this.objects.length;i++){
        this.objects[i].width=this.container.width/5-this.container.width*0.05;
        this.objects[i].height=this.container.height/5-this.container.height*0.05;
        this.objects[i].x = (i % 5) * this.container.width/5+this.border-i;
        this.objects[i].y = Math.floor(i / 5) * this.container.height/5+this.border-i;
      }
    }
};

function showHide(){
  if (game.inventory.container.visible){
    game.inventory.container.visible = false;
    game.player.lock=false;
  }else{
    game.inventory.container.visible = true;
    game.player.lock=true;
  }
}
