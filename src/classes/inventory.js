import {game} from '../game.js';

export class Inventory{
  constructor(){
      this.container=new PIXI.Container();
      this.container.visible=false;
      this.objects=[];
      this.background=new PIXI.Sprite(PIXI.Texture.from(game.settings.Inventory.Background));
      this.background.width=game.width/2;
      this.background.height=game.height/2;
      this.background.parentLayer = game.layerUI;
      this.container.x = (game.width - this.background.width) / 2;
      this.container.y = (game.height - this.background.height) / 2;
      this.border=10;
      this.icon=new PIXI.Sprite(PIXI.Texture.from(game.settings.Inventory.Icon));
      this.icon.visible=false;
      this.icon.interactive=true;
      this.icon.buttonMode=true;
      this.icon.parentLayer = game.layerUI;
      this.icon.on('pointertap',InventoryClick);
      this.container.addChild(this.background);
    }

    show(){
      this.container.visible=true;
    }

    hide(){
      this.container.visible=false;
    }

    showIcon(){
      this.icon.visible=true;
    }

    hideIcon(){
      this.icon.visible=false;
    }

    setIcon(position){
      if(position=="bottom-right"){
        this.icon.x=game.width - this.icon.width;
        this.icon.y=game.height - this.icon.height;
      }else if(position=="top-right"){
        this.icon.x=game.width - this.icon.width;
        this.icon.y=0;
      }else if(position=="bottom-left"){
        this.icon.x=0;
        this.icon.y=game.height - this.icon.height;
      }else if(position=="bottom-top"){
        this.icon.x=game.width - this.icon.width;
        this.icon.y=0;
      }
    }

    remove(nameObject)
    {
      let objectToRemove=this.searchObject(nameObject);
      //Remove it if it's inside inventory
      if(objectToRemove) this.objects.splice(objectToRemove,1);
      game.objects[game.searchObject(nameObject)].destroy();
      this.update();
    }

    searchObject(nameObject){
      let numberObject;
      for(let i=0;i<this.objects.length;i++){
        if(nameObject==this.objects[i].data.Name){

          numberObject=i;
          break;
        }
      }
      return numberObject;
    }

    //Reorder inventory objects
    update(){
      for(let i=0;i<this.objects.length;i++){
        this.objects[i].width=this.container.width/5-this.container.width*0.05;
        this.objects[i].height=this.container.height/5-this.container.height*0.05;
        this.objects[i].x = ((i % 5) * this.container.width/5+this.border-i)+this.objects[i].width/2;
        this.objects[i].y = (Math.floor(i / 5) * this.container.height/5+this.border-i)+this.objects[i].height;
      }
    }
};

function InventoryClick(){
  if (game.inventory.container.visible) game.inventory.hide();
  else if(game.player.action!="take" && !game.player.lock)  game.inventory.show();
}
