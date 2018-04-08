import {game} from '../game.js';

export class inventory{
  constructor(data,index){
      this.name=data.Name;
      this.index=index;
      this.description=data.Description;
      this.container=new PIXI.Container();
      this.container.x = (game.app.screen.width - this.sprite.width) / 2;
      this.container.y = (game.app.screen.height - this.sprite.height) / 2;
      this.container.visible=false;
      this.icon=new PIXI.Sprite(PIXI.Texture.fromFrame("inventory.png"));
      this.icon.x=game.app.screen.width - this.sprite.width;
      this.icon.y=game.app.screen.height - this.sprite.height;
      this.icon.on('pointerup',this.click);
    }
    click(){
      if (this.container.visible) this.container.visible = false;
      else this.container.visible = true;
    }
};

export class inventoryObject{
  constructor(){

  }
};

function onDragStart(event) {
  // store a reference to the data
  // the reason for this is because of multitouch
  // we want to track the movement of this particular touch
  this.posX = this.x;
  this.posY = this.y;
  this.data = event.data;
  this.alpha = 0.5;
  this.dragging = true;
}

function onDragEnd() {
  this.x = this.posX;
  this.y = this.posY;
  this.alpha = 1;
  this.dragging = false;
  // set the interaction data to null
  this.data = null;
}

function onDragMove() {
  if (this.dragging) {
    var newPosition = this.data.getLocalPosition(this.parent);
    this.x = newPosition.x;
    this.y = newPosition.y;
  }
}
