class Core{
  constructor(width,height,objectID){
    this.files=[];
    this.scenes=[];
    this.objects=[];
    this.scenesJSON=[];
    this.objectsJSON=[];
    this.player={};
    this.playerTween;
    this.actionMenu;
    this.resources;
    this.currentScene;
    this.selectedObject=null;
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
    this.currentScene=nextScene;
    this.player.sprite.visible=this.scenesJSON[nextScene].Player;
  }
  showMenu(object){
    //Requires improvement
    let posY=50;
    if(object.sprite.anchor.y>0) posY+=object.sprite.height;
    this.actionMenu.container.x=object.sprite.x-object.sprite.width/2;
    this.actionMenu.container.y=object.sprite.y-posY;
    this.actionMenu.container.visible=true;
  }
  hideMenu(){
    this.actionMenu.container.visible=false;
  }
};

export {Core};
