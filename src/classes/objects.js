import {game} from '../game.js';
import * as PIXI from 'pixi.js';
import {boxesIntersect,collision} from './utils.js';
import {resolvePuzzle} from'./puzzle.js';

export class gameObject extends PIXI.Sprite{
  constructor(data,index){
    if(data.Texture) super(PIXI.Texture.fromFrame(data.Texture));
    else if(data.Area){
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
      this.longPress=false;
      if(!data.Button) this.on('pointerdown', onTouchStart)
                           .on('pointerup', onTouchEnd);
      if(data.Door){
        this.door=true;
        this.newScene=data.Door.To;
        this.playerPos=data.Door.Player;
        this.use=Goto;
        if(data.Button) this.on('pointerup', Goto);
      }else if(this.takable){
        this.on('pointerdown', onTakeStart)
                                  .on('pointerup', onTakeEnd)
                                  .on('pointerupoutside', onTakeEnd)
                                  .on('pointermove', onTakeMove);
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
                              .on('pointerup', onDragEnd)
                              .on('pointerupoutside', onDragEnd)
                              .on('pointermove', onDragMove);
    game.selectedObject=false;
    game.inventory.update();
  }
};

function Goto(){
  game.goScene(this.newScene,this.playerPos);
}

//Object events when touch start and ends
function onTouchStart(event){
    this.pressing=setTimeout(function(){game.longPress=true;}, 500);
}

function onTouchEnd(event){
  clearTimeout(this.pressing);
  game.selectedObject=this.index;
  game.player.move(event);
}

//Drag the object while It is in the Inventory
function onDragStart(event) {
  // we want to track the movement of this particular touch
  game.player.lock=true;
  this.posX = this.x;
  this.posY = this.y;
  this.data = event.data;
  this.objectEvent=event;
  this.alpha = 0.5;
  this.dragging = true;
}

function onDragEnd() {
  if(this.data){
    if(this.usable){
      let targetObj=game.objects[game.searchObject(this.usable.Target)];
      let result;
      if(targetObj.hitArea) result=collision(targetObj.hitArea.points,this.x,this.y);
      else result=targetObj.containsPoint(new PIXI.Point(this.x,this.y))
      if(result && targetObj.parent.visible)
      {
        resolvePuzzle(this,targetObj);
      }//else game.player.say(game.settings.NotUsable[game.mainLanguage]);
    }
    this.x = this.posX;
    this.y = this.posY;
    this.setParent(game.inventory.container);
  }
  this.alpha = 1;
  this.dragging = false;
  // set the interaction data to null
  this.data = null;
  setTimeout(function(){ game.player.lock=false;}, 50);
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
  }else if(this.data){
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
  setTimeout(function(){ game.player.lock=false; }, 50);
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
