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
      this.update();
      this.container.visible=true;
      game.player.lock=true;
    }

    hide(){
      this.container.visible=false;
      game.player.lock=false;
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

    add(nameObject)
    {
      //Make sure object isn't inside the inventory already
      if(!this.objects.includes(nameObject)){
        this.objects.push(nameObject);
        this.container.addChild(game.objects[game.searchObject(nameObject)]);
        this.update();
      }
    }

    remove(nameObject)
    {
      //Check if object is already in inventory
      if(this.objects.includes(nameObject)){
        this.objects.splice(this.objects.indexOf(nameObject),1);
        this.update();
      }
    }

    //Reorder inventory objects
    update(){
      let i;
      let numObjs=this.objects.length;
      for(i=0;i<numObjs;i++){
        let tmpObj=game.objects[game.searchObject(this.objects[i])];
        tmpObj.width=this.container.width/5-this.container.width*0.05;
        tmpObj.height=this.container.height/5-this.container.height*0.05;
        tmpObj.x = ((i % 5) * this.container.width/5+this.border-i)+tmpObj.width/2;
        tmpObj.y = (Math.floor(i / 5) * this.container.height/5+this.border-i)+tmpObj.height;
        this.container.width=this.background.width;
        this.container.height=this.background.height;
      }
    }
};

function InventoryClick(){
  if (game.inventory.container.visible) game.inventory.hide();
  else if(game.player.action!="take" && !game.player.lock)  game.inventory.show();
}
