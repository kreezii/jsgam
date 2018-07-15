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
    this.usable=data.Use;

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
                              .on('pointerup', onDragEnd)
                              .on('pointerupoutside', onDragEnd)
                              .on('pointermove', onDragMove);
    game.inventory.update();
    game.selectedObject=false;
    game.player.action=null;
  }
};

function Goto(){
  game.goScene(this.newScene,this.playerPos);
}

//Object events when touch start and ends
function onTouchStart(event){
  if(this.usable) this.pressing=setTimeout(function(){game.player.action="use"}, 500);
}

function onTouchEnd(event){
  if(!game.player.lock)
  {
    clearTimeout(this.pressing);
    game.selectedObject=this.index;
    game.player.move(event.data.getLocalPosition(game.app.stage));
  }
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
      let originObj;
      let targetObj;
      let result;
      let check;

      if(this.usable.Origin){
        originObj=game.objects[game.searchObject(this.usable.Origin)];
        targetObj=this;
        check=originObj;
      }else{
        originObj=this;
        targetObj=game.objects[game.searchObject(this.usable.Target)];
        check=targetObj;
      }

      if(check.hitArea) result=collision(check.hitArea.points,this.x,this.y);
      else result=check.containsPoint(new PIXI.Point(this.x,this.y))
      if(result && targetObj.parent.visible)
      {
        resolvePuzzle(originObj,targetObj);
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
  if(boxesIntersect(this,game.inventory.icon)) game.player.action="take";

  this.setParent(this.oldParent);
  this.parentLayer = game.layer;
  this.x = this.posX;
  this.y = this.posY;

  game.selectedObject=this.index;
  game.player.lock=false;
  game.player.move({x:this.posX,y:this.posY});

  this.alpha = 1;
  this.dragging = false;

  // set the interaction data to null
  this.data = null;
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
