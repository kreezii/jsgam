import {game} from '../game.js';
import * as PIXI from 'pixi.js';
import {boxesIntersect,collision} from './utils.js';

export class gameObject extends PIXI.Sprite{
  constructor(data,index){
    if(data.Texture){
      super(PIXI.Texture.fromFrame(data.Texture));
    }else if(data.Area){
      super(PIXI.Texture.EMPTY);
      this.hitArea=new PIXI.Polygon(data.Area);
    }
    this.data=data;
    this.index=index;

    //this.usable=data.Use;

    if(data.Position){
      this.x=data.Position[0];
      this.y=data.Position[1];
    }
    if(data.Size){
      this.scale.set(data.Size)
    }

    if(!data.Area)this.anchor.set(0.5,1);
    this.parentLayer = game.layer;

    if(data.Interactive){
      this.interactive=data.Interactive;
      this.buttonMode=true;
      if(!data.Button) this.on('pointerdown', onTouchStart)
                           .on('pointerup', onTouchEnd);
      if(data.Door){
        this.door=true;
        this.newScene=data.Door.To;
        this.playerPos=data.Door.Player;
        this.use=Goto;
        if(data.Button) this.on('pointerup', Goto);
        else this.on('pointerup',onDoorTouch);
      }else if(data.Take){
        this.on('pointerdown', onTakeStart).on('pointerdown', onDragStart)
                                  .on('pointerup', onTakeEnd).on('pointerup', onDragEnd)
                                  .on('pointerupoutside', onTakeEnd).on('pointerupoutside', onDragEnd)
                                  .on('pointermove', onDragMove);
      }else if(this.usable){
      //  this.use=
      }
    }

    if(data.Use) this.usable=data.Use;
  }

  take(){
    game.inventory.container.addChild(this);
    game.inventory.objects.push(this);
    this.parentLayer=game.layerUI;
    this.anchor.set(0,0);
    this.x=0;
    this.y=0;
    this.removeAllListeners();
    this.on('pointerdown', onDragStart)
                              .on('pointerup', onInventoryEnd).on('pointerup', onDragEnd)
                              .on('pointerupoutside', onInventoryEnd).on('pointerupoutside', onDragEnd)
                              .on('pointermove', onDragMove).on('pointermove', onInventoryMove);
    game.inventory.update();
    game.selectedObject=false;
    game.player.action=null;
  }
};

function onDoorTouch(){
  game.player.action="use";
}

function Goto(){
  game.changeScene(this.newScene,this.playerPos);
}

//Object events when touch start and ends
function onTouchStart(event){
  this.interaction = event.data;
  //if(this.usable) this.pressing=setTimeout(function(){game.player.action="use"}, 500);
}

function onTouchEnd(event){

  if(this.interaction)
  {
    //clearTimeout(this.pressing);
    game.selectedObject=this.index;
    game.player.move(event.data.getLocalPosition(game.app.stage));
    //game.player.move({x:this.x,y:this.y});
  }
}

//Drag the object while It is in the Inventory
function onDragStart(event) {
  // we want to track the movement of this particular touch
  this.posX = this.x;
  this.posY = this.y;
  this.interaction = event.data;
  //this.objectEvent=event;
  this.alpha = 0.5;
  this.dragging = true;
}

function onDragEnd() {
  this.alpha = 1;
  this.dragging = false;
  // set the interaction data to null
  this.interaction = null;
}

function onInventoryEnd(){
  if(this.interaction){
    game.checkPuzzle(this.data.Name);
    this.x = this.posX;
    this.y = this.posY;
    this.setParent(game.inventory.container);
  }

}

function onDragMove() {
  if (this.dragging) {
    this.setParent(game.app.stage);
    var newPosition = this.interaction.getLocalPosition(this.parent);
    this.x = newPosition.x;
    this.y = newPosition.y;
  }
}

function onInventoryMove() {
  if (this.dragging) {
    if(!boxesIntersect(this,game.inventory.container)){
      game.inventory.container.visible=false;
    }
  }
}

//Drag the object while It is in the scene
function onTakeStart(event) {
  this.oldParent=this.parent;
  this.parentLayer=game.layerUI;
}

function onTakeEnd() {
  if(this.interaction){
    if(collision(this,game.inventory.icon)) game.player.action="take";

    this.setParent(this.oldParent);
    this.parentLayer = game.layer;
    this.x = this.posX;
    this.y = this.posY;

    game.selectedObject=this.index;
    game.player.move({x:this.posX,y:this.posY});
  }
}
