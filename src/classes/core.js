class Core{
  constructor(width,height,objectID){
    this.files=[];
    this.scenes=[];
    this.objects=[];
    this.scenesJSON=[];
    this.objectsJSON=[];
    this.player={};
    this.playerTween;
    this.resources;
    this.currentScene;
    this.app=new PIXI.Application(width,height);
    this.app.stage = new PIXI.display.Stage();//Z-order
  //  this.app.stage.group.enableSort = true;//Z-order
    this.sortGroup= new PIXI.display.Group(0, true);//Z-order
    this.sortGroup.on('sort', function (sprite) {
      sprite.zOrder = -sprite.y;
    });//Z-order
    this.layer=new PIXI.display.Layer(this.sortGroup);
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
    this.currentScene=nextScene.index;
    this.player.sprite.visible=this.scenesJSON[nextScene].Player;
  }
};

export {Core};
