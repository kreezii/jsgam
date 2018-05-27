import {game} from '../game.js';
import * as PIXI from 'pixi.js';
import {boxesIntersect,collision} from './utils.js';

export class gameObject extends PIXI.Sprite{
  constructor(data,index){
    if(data.Texture) super(PIXI.Texture.fromFrame(data.Texture));
    if(data.Area){
      super(PIXI.Texture.EMPTY);
      this.hitArea=new PIXI.Polygon(data.Area);
    }
    this.name=data.Name;
    this.index=index;
    this.description=data.Description;
    this.takable=data.Take;

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
      if(data.Door){
        this.newScene=data.Door;
        this.on('pointerup', Goto);
      }else if(this.takable){
        this.on('pointerdown', onTakeStart)
                                  .on('pointerup', onTakeEnd)
                                  .on('pointerupoutside', onTakeEnd)
                                  .on('pointermove', onTakeMove);
      }else this.on('pointerup', Examine);
    }

    if(data.Use) this.puzzle=data.Use;
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
                              .on('pointerup', onDragEnd)
                              .on('pointerupoutside', onDragEnd)
                              .on('pointermove', onDragMove);
    game.selectedObject=false;
    game.hideMenu();
    game.inventory.update();
  }

};

function Goto(){
  game.goScene(this.newScene);
}

function Examine(event){
  game.selectedObject=this.index;
  game.player.move(event);

}

//Drag the object while It is in the Inventory
function onDragStart(event) {
  // we want to track the movement of this particular touch
  this.posX = this.x;
  this.posY = this.y;
  this.data = event.data;
  this.alpha = 0.5;
  this.dragging = true;
}

function onDragEnd() {
  let targetObj=game.objects[game.searchObject(this.puzzle.Target)];
  let result=collision(targetObj.hitArea.points,this.x,this.y);
  this.setParent(game.inventory.container);
  this.x = this.posX;
  this.y = this.posY;
  this.alpha = 1;
  this.dragging = false;
  // set the interaction data to null
  this.data = null;

  console.log(result)
  if(result)
  {

    if(this.puzzle.Result[0]=="DoorTo"){
      targetObj.newScene=this.puzzle.Result[1];
      targetObj.removeAllListeners();
    setTimeout(function(){  targetObj.on('pointerup',Goto)});
      //setTimeout();
    }
    console.log("Open door")
  }
}

function onDragMove() {
  if (this.dragging) {
    this.setParent(game.app.stage);
    var newPosition = this.data.getLocalPosition(this.parent);
    this.x = newPosition.x;
    this.y = newPosition.y;
    if(!boxesIntersect(this,game.inventory.container)){
      game.inventory.container.visible=false;
    }
  }
}

//Drag the object while It is in the scene
function onTakeStart(event) {
  this.oldParent=this.parent;
  this.parentLayer=game.layerUI;
  this.posX = this.x;
  this.posY = this.y;
  this.data = event.data;
  this.objectEvent=event;
  this.alpha = 0.5;
  this.dragging = true;
}

function onTakeEnd() {
  if(boxesIntersect(this,game.inventory.icon)){
    this.take();
  }else{
    this.setParent(this.oldParent);
    this.parentLayer = game.layer;
    this.x = this.posX;
    this.y = this.posY;
    game.selectedObject=this.index;
    game.player.move(this.objectEvent);
  }
  this.alpha = 1;
  this.dragging = false;
  // set the interaction data to null
  this.data = null;
  setTimeout(function(){ game.player.lock=false; }, 5);

}

function onTakeMove() {
  if (this.dragging) {
    game.player.lock=true;
    this.setParent(game.app.stage);
    var newPosition = this.data.getLocalPosition(this.parent);
    this.x = newPosition.x;
    this.y = newPosition.y;

  }
}
