import {game} from '../game.js';
import {boxesIntersect,collision} from '../collisions.js';

/**
 * Game Objects.
 * @constructor
 * @param {object} data - Data from JSON file with the object's config.
 */


export class Objeto extends PIXI.extras.AnimatedSprite{
  constructor(data){

    if(data.Texture){
      //Generate a static object from a texture
      super([PIXI.Texture.from(data.Texture)],false);

    }else if(data.Area){

      //For invisible objects
      super([PIXI.Texture.EMPTY],false);
      this.hitArea=new PIXI.Polygon(data.Area);

    }else if(data.Animation){

      //Animated objects
      let spritesheet=PIXI.loader.resources[data.Animation.Name].spritesheet;

      let frames = [];
      for (var i = 0; i < spritesheet._frameKeys.length; i++) {
          frames.push(PIXI.Texture.from(spritesheet._frameKeys[i]));
      }

      super(frames);
      this.animationSpeed=data.Animation.Speed;
      this.play();
    }

    this.data=data;

    //Position of the object in the screen
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

  hide(){
    this.visible=false;
  }

  show(){
    this.visible=true;
  }
  take(){
    this.show();
    this.removeAllListeners();
    this.on('pointerdown', onDragStart)
        .on('pointerup', onInventoryEnd).on('pointerup', onDragEnd)
        .on('pointerupoutside', onInventoryEnd).on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove).on('pointermove', onInventoryMove)
        .on('pointertap',onInventoryTap);
    this.use=InventoryUse;
    //If it's an animated object we stop its animation
    if(this.playing) this.stop();

    this.parentLayer=game.layerUI;
    game.inventory.add(this.data.Name);

    game.selectedObject=false;
    game.player.action=null;
  }
};

function onDoorTouch(event){
  if(!game.player.lock){
  game.player.action="use";
  let moveTo={x:this.x,y:this.y};
  if(this.data.Area) moveTo=event.data.getLocalPosition(game.app.stage);
  //game.player.lock=true;
  game.selectedObject=game.searchObject(this.data.Name);
  game.player.move(moveTo);
}
}

function ChangeRoom(){
  game.changeScene(this.newScene,this.playerPos);
}

function onTap(event){
  //if(game.player.action==null) game.player.action="look";
  if(!game.player.lock && !this.moved)
  {
    game.player.action="look";
    let moveTo={x:this.x,y:this.y};
    if(this.data.Area) moveTo=event.data.getLocalPosition(game.app.stage);
    //game.player.lock=true;
    game.selectedObject=game.searchObject(this.data.Name);;
    game.player.move(moveTo);
  }
}

//Drag the object while It is in the inventory
function onDragStart(event) {
  // we want to track the movement of this particular touch
  this.posX = this.x;
  this.posY = this.y;
  this.interaction = event.data;
  this.alpha = 0.5;
  this.dragging = true;
  this.moved = false;
}

//Drag ends while the object is inside the inventory
function onDragEnd() {
  this.alpha = 1;
  this.dragging = false;
  // set the interaction data to null
  this.interaction = null;
}

function onInventoryEnd(event){
  if(this.interaction && this.moved){
    game.checkPuzzle(this.data.Name);
    //game.player.lock=true;
    game.player.action="use";
    game.selectedObject=game.searchObject(this.data.Name);
    this.x = this.posX;
    this.y = this.posY;
    this.setParent(game.inventory.container);
    if(!game.inventory.container.visible){
      game.player.move(event.data.getLocalPosition(game.app.stage));
    }else{
      InventoryUse();
    }
  }

}

function onUseMove(event){
  if(this.dragging) {
  //  this.holding+=1;
    this.moved=true;
  }
}

function onUseEnd(event){
  if(this.interaction && this.moved){
    this.holding=0;
    game.checkPuzzle(this.data.Name);
    //game.player.lock=true;
    game.player.action="use";
    game.selectedObject=game.searchObject(this.data.Name);;
    game.player.move({x:this.x,y:this.y});
  }

}

function onDragMove() {
  if (this.dragging) {
    this.moved=true;
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
    this.moved=true;
    if(!boxesIntersect(this,game.inventory.container)){
      game.inventory.container.visible=false;
    }
  }
}

function onInventoryTap() {
  if(!this.moved)
    game.player.say(this.data.Description[game.mainLanguage]);
}

//Drag the object while It is in the scene
function onTakeStart(event) {
  this.oldParent=this.parent;
  this.parentLayer=game.layerUI;
}

function onTakeEnd() {
  if(this.interaction){
    if(collision(this,game.inventory.icon) && !game.player.lock){
      game.player.action="take";
    //  game.player.lock=true;
      game.selectedObject=game.searchObject(this.data.Name);
      game.player.move({x:this.posX,y:this.posY});
    }
    this.setParent(this.oldParent);
    this.parentLayer = game.layer;
    this.x = this.posX;
    this.y = this.posY;
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
