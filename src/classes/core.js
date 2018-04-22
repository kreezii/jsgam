class Core{
  constructor(width,height,objectID){
    this.files=[];
    this.scenes=[];
    this.objects=[];
    this.sounds=[];
    this.scenesJSON=[];
    this.objectsJSON=[];
    this.player={};
    this.playerTween;
    this.actionMenu;
    this.resources;
    this.currentScene;
    this.selectedObject=null;
    this.inventory;
    this.inventoryBack="inventory-background.png";
    this.inventoryIcon="inventory-icon.png";
    this.app=new PIXI.Application(width,height);

    //Z-Order
    this.app.stage = new PIXI.display.Stage();
    this.sortGroup= new PIXI.display.Group(0, true);
    this.sortGroup.on('sort', function (sprite) {
      sprite.zOrder = -sprite.y;
    });
    this.onTopGroup = new PIXI.display.Group(1,false);
    this.UIGroup = new PIXI.display.Group(2,false);
    this.layer=new PIXI.display.Layer(this.sortGroup);
    this.layeronTop=new PIXI.display.Layer(this.onTopGroup);
    this.layerUI=new PIXI.display.Layer(this.UIGroup);
    this.layerUI.group.enableSort = true;
    this.layer.group.enableSort = true;

    this.width=width;
    this.height=height;

    this.loadingText=new PIXI.Text("0 %", {
          fontFamily: 'Arial',
          fontSize: 35,
          fill: 'white',
          align: 'left'
    });
    if(!objectID) document.body.appendChild(this.app.view);
    else document.getElementById(objectID).appendChild(this.app.view);
    this.app.stage.addChild(this.layer);//Z-order
    this.app.stage.addChild(this.layeronTop);//Z-order
    this.app.stage.addChild(this.layerUI);//Z-order
  }

  searchScene(nameScene){
    let numberScene;
    for(let i=0;i<this.scenes.length;i++){
      if(nameScene==this.scenes[i].name){
        numberScene=i;
        break;
      }
    }
    //return this.scenes[numberScene];
    return numberScene;
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

  loop(){
    PIXI.tweenManager.update();
  }

  goScene(sceneName){
    let nextScene=this.searchScene(sceneName);
    this.scenes[this.currentScene].container.visible=false;
    this.scenes[nextScene].container.visible=true;
    PIXI.sound.stop(this.scenes[this.currentScene].music);
    this.currentScene=nextScene;
    this.player.sprite.visible=this.scenesJSON[nextScene].Player;
  }

  showMenu(){
    //Requires improvement
    let selectedSprite=this.objects[this.selectedObject].sprite;
    let posY=50;
    if(selectedSprite.anchor.y>0) posY+=selectedSprite.height;
    this.actionMenu.container.x=selectedSprite.x-selectedSprite.width/2;
    this.actionMenu.container.y=selectedSprite.y-posY;
    this.actionMenu.container.visible=true;
  }

  hideMenu(){
    this.actionMenu.container.visible=false;
  }

  showInventory(){
    if (this.inventory.container.visible){
      this.inventory.container.visible = false;
      this.player.lock=false;
    }else{
      this.inventory.container.visible = true;
      this.player.lock=true;
    }
  }

  take(){
    let selectedSprite=this.objects[this.selectedObject].sprite;
    this.inventory.container.addChild(selectedSprite);
    this.inventory.objects.push(selectedSprite);
    this.selectedObject.sprite.parentLayer=this.layerUI;
    this.selectedObject.sprite.x=0+this.selectedObject.sprite.width;
    this.selectedObject.sprite.y=0+this.selectedObject.sprite.height;
    this.selectedObject.sprite.on('pointerdown', onDragStart)
                              .on('pointerup', onDragEnd)
                              .on('pointerupoutside', onDragEnd)
                              .on('pointermove', onDragMove);
    this.selectedObject=false;
    this.hideMenu();
  }

  updateInvetory(){

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
export {Core};
