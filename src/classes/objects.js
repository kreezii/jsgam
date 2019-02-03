import {game} from '../game.js';
import {boxesIntersect,collision} from '../collisions.js';

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

    if(data.Position){
      this.x=data.Position[0];
      this.y=data.Position[1];
    }
    if(data.Size){
      this.scale.set(data.Size)
    }

    if(!data.Area)this.anchor.set(0.5,1);
    if(data.Layer=="Front") this.parentLayer=game.layeronTop;
    else this.parentLayer = game.layer;

    if(data.Look || data.Door || data.Take || data.Use){
      this.interactive=true;
      this.buttonMode=true;

      //On touch examine the item
      this.on('pointertap',onTap);

      if(data.Door){
        this.door=true;
        this.newScene=data.Door.To;
        this.playerPos=data.Door.Player;
        this.use=ChangeRoom;
        this.on('pointerup',onDoorTouch);
      }

      if(data.Take){
        this.on('pointerdown', onTakeStart).on('pointerdown', onDragStart)
            .on('pointerup', onTakeEnd).on('pointerup', onDragEnd)
            .on('pointerupoutside', onTakeEnd).on('pointerupoutside', onDragEnd)
            .on('pointermove', onDragMove);
      }else if(data.Use){
        this.holding=0;
        this.use=InventoryUse;
        this.on('pointerdown', onDragStart)
            .on('pointerup', onUseEnd).on('pointerup', onDragEnd)
            .on('pointerupoutside', onUseEnd).on('pointerupoutside', onDragEnd)
            .on('pointermove', onUseMove);
      }
    }
  }

  take(){
    game.inventory.container.addChild(this);
    game.inventory.objects.push(this);
    this.parentLayer=game.layerUI;
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
    this.use=InventoryUse;
  }
};

function onDoorTouch(){
  game.player.action="use";
}

function ChangeRoom(){
  game.changeScene(this.newScene,this.playerPos);
}

function onTap(event){
  if(game.player.action==null) game.player.action="look";
  if(!game.player.lock)
  {
    let moveTo={x:this.x,y:this.y};
    if(this.data.Area) moveTo=event.data.getLocalPosition(game.app.stage);
    game.player.lock=true;
    game.selectedObject=this.index;
    game.player.move(moveTo);
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

function onInventoryEnd(event){
  if(this.interaction){

    game.checkPuzzle(this.data.Name);
    game.player.lock=true;
    game.player.action="use";
    game.selectedObject=this.index;
    game.player.move(event.data.getLocalPosition(game.app.stage));
    this.x = this.posX;
    this.y = this.posY;
    this.setParent(game.inventory.container);
  }

}

function onUseMove(event){
  if(this.dragging) {
    this.holding+=1;
  }
}

function onUseEnd(event){
  if(this.interaction && this.holding>3){
    this.holding=0;
    game.checkPuzzle(this.data.Name);
    game.player.lock=true;
    game.player.action="use";
    game.selectedObject=this.index;
    game.player.move({x:this.x,y:this.y});
  }

}

function onDragMove() {
  if (this.dragging) {
    this.setParent(game.app.stage);
    var newPosition = this.interaction.getLocalPosition(this.parent);
    let bounds=this.getBounds();
    //We can only move the object inside the stage
    if(newPosition.x>bounds.width/2 && newPosition.x<game.width-bounds.width/2) this.x = newPosition.x;
    if(newPosition.y>bounds.height && newPosition.y<game.height) this.y = newPosition.y;
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
    game.player.lock=true;
    game.selectedObject=this.index;
    game.player.move({x:this.posX,y:this.posY});
  }
}

function InventoryUse(){
  if(game.currentPuzzle){
    game.currentPuzzle.resolvePuzzle();
    game.currentPuzzle=false;
  }else{
    game.player.say(game.settings.NotUsable[game.mainLanguage]);
  }
}
