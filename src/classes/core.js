class Core{
  constructor(width,height){
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
    this.inventoryBack="inventory-bg.png";
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
    //this.layerUI.group.enableSort = true;
    //this.layer.group.enableSort = true;
    this.app.stage.group.enableSort = true;

    this.width=width;
    this.height=height;

    this.loadingText=new PIXI.Text("0 %", {
          fontFamily: 'Arial',
          fontSize: 35,
          fill: 'white',
          align: 'left'
    });
document.body.appendChild(this.app.view);
    /*
    if(!objectID) document.body.appendChild(this.app.view);
    else document.getElementById(objectID).appendChild(this.app.view);
    */
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
    if(this.scenes[nextScene].music!=undefined)
      PIXI.sound.play(this.scenes[nextScene].music,{loop:true});
    this.currentScene=nextScene;
    this.player.sprite.visible=this.scenes[this.currentScene].player;
    let inventoryOpt=this.scenes[this.currentScene].inventory;
    if(inventoryOpt) this.inventory.icon.visible=true;
  }

  showMenu(){
    //Requires improvement
  //  let selectedSprite=this.objects[this.selectedObject].sprite;
  /*  let selectedSprite=this.objects[this.selectedObject];
    let posY=50;
    if(selectedSprite.anchor.y>0) posY+=selectedSprite.height;
    this.actionMenu.container.x=selectedSprite.x-selectedSprite.width/2;
    this.actionMenu.container.y=selectedSprite.y-posY;*/
    this.actionMenu.container.x=0;
    this.actionMenu.container.y=0;
    this.actionMenu.container.visible=true;
  }

  hideMenu(){
    this.actionMenu.container.visible=false;
  }

};

export {Core};
