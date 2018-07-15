class Core{
  constructor(width,height){
    this.files=[];
    this.scenes=[];
    this.objects=[];
    this.characters=[];
    this.sounds=[];
    this.settings=[];
    this.mainLanguage=0;
    this.timeout;
    this.scenesJSON=[];
    this.objectsJSON=[];
    this.charactersJSON=[];
    this.player={};
    this.playerTween;
    this.resources;
    this.currentScene;
    this.selectedObject=null;
    this.inventory;
    this.inventoryBack="inventory-bg.png";
    this.inventoryIcon="inventory-icon.png";
    this.app=new PIXI.Application(width,height);
    this.longPress=false;
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
    this.textStyle = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 20,
        fontWeight: 'bold',
        fill: '#ffffff', // gradient
        stroke: '#000000',
        strokeThickness: 5,
        align: 'center',
        wordWrap: true,
        wordWrapWidth: this.app.screen.width/2
    });
    this.loadingText=new PIXI.Text("0 %", {
          fontFamily: 'Arial',
          fontSize: 35,
          fill: 'white',
          align: 'left'
    });

    this.playerText=new PIXI.Text("", this.textStyle);

    this.playerText.parentLayer = this.layerUI;
    this.playerText.anchor.set(0.5);
    this.playerText.visible=false;
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

  searchCharacter(nameCharacter){
    let numberCharacter;
    for(let i=0;i<this.characters.length;i++){
      if(nameCharacter==this.characters[i].name){

        numberCharacter=i;
        break;
      }
    }
    return numberCharacter;
  }

  loop(){
    PIXI.tweenManager.update();
    let animationProgress=this.player.sprite.animation.getState(this.player.state);
    if(animationProgress!=null)
    {
      if(this.player.state=="take" && animationProgress.isCompleted){
        this.objects[this.selectedObject].take();
        this.player.stand();
      }else if(this.player.state=="use" && animationProgress.isCompleted){
        this.objects[this.selectedObject].use();
        this.player.stand();
      }
    }
    //Scale Player
    let scalePlayer=this.player.sprite.y/this.app.screen.height*this.scenes[this.currentScene].playerSize;
    this.player.sprite.scale.set(scalePlayer);

  }

  goScene(sceneName,pos){
    let nextScene=this.searchScene(sceneName);
    this.scenes[this.currentScene].container.visible=false;
    this.scenes[nextScene].container.visible=true;
    PIXI.sound.stop(this.scenes[this.currentScene].music);
    if(this.scenes[nextScene].music!=undefined)
      PIXI.sound.play(this.scenes[nextScene].music,{loop:true});
    this.currentScene=nextScene;
    if(pos){
      this.player.sprite.x=pos[0];
      this.player.sprite.y=pos[1];
      this.player.sprite.visible=this.scenes[this.currentScene].player;
    }
    let inventoryOpt=this.scenes[this.currentScene].inventory;
    if(inventoryOpt) this.inventory.icon.visible=true;
  }

  start(){
    this.currentScene=0;
    this.goScene(this.settings.MainScene);
  };

};

export {Core};
