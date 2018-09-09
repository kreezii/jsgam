import * as filters from 'pixi-filters';

class Core{
  constructor(width,height,objectID){
    this.files=[];
    this.logoScreen;
    this.titleScreen;
    this.scenes=[];
    this.objects=[];
    this.characters=[];
    this.puzzles=[];
    this.sounds=[];
    this.settings=[];
    this.mainLanguage=0;
    this.timeout;
    this.scenesJSON=[];
    this.objectsJSON=[];
    this.charactersJSON=[];
    this.puzzlesJSON=[];
    this.player={};
    this.playerTween;
    this.resources;
    this.currentScene;
    this.selectedObject=null;
    this.inventory;
    this.inventoryBack="inventory-bg.png";
    this.inventoryIcon="inventory-icon.png";
    this.app=new PIXI.Application(width,height,{autoResize: true});
    this.OldFimFilter=new filters.OldFilmFilter();
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
    //document.body.appendChild(this.app.view);

    if(!objectID) document.body.appendChild(this.app.view);
    else document.getElementById(objectID).appendChild(this.app.view);

    this.app.stage.addChild(this.layer);//Z-order
    this.app.stage.addChild(this.layeronTop);//Z-order
    this.app.stage.addChild(this.layerUI);//Z-order
  }

  searchScene(nameScene){
    let numberScene;
    for(let i=0;i<this.scenes.length;i++){
      if(nameScene==this.scenes[i].data.Name){
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
      if(nameObject==this.objects[i].data.Name){

        numberObject=i;
        break;
      }
    }
    return numberObject;
  }

  searchPuzzle(namePuzzle){
    let numberPuzzle;
    for(let i=0;i<this.puzzles.length;i++){
      if(namePuzzle==this.puzzles[i].data.Name){

        numberPuzzle=i;
        break;
      }
    }
    return numberPuzzle;
  }

  searchCharacter(nameCharacter){
    let numberCharacter;
    for(let i=0;i<this.characters.length;i++){
      if(nameCharacter==this.characters[i].data.Name){

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
    //let scalePlayer=this.player.sprite.y/this.app.screen.height*this.scenes[this.currentScene].playerSize;
    //this.player.sprite.scale.set(scalePlayer);

  }

  changeScene(sceneName,pos){
    this.player.action=null;
    let nextScene=this.searchScene(sceneName);
    this.scenes[this.currentScene].container.visible=false;
    this.scenes[nextScene].container.visible=true;
    PIXI.sound.stop(this.scenes[this.currentScene].data.Music);
    if(this.scenes[nextScene].data.Music!=undefined)
      PIXI.sound.play(this.scenes[nextScene].data.Music,{loop:true});
    this.currentScene=nextScene;
    if(pos){
      this.player.sprite.x=pos[0];
      this.player.sprite.y=pos[1];
      this.player.sprite.visible=this.scenes[this.currentScene].data.Player;
    }
    let inventoryOpt=this.scenes[this.currentScene].data.Inventory;
    if(inventoryOpt) this.inventory.icon.visible=true;
  }

  checkPuzzle(nameObject){
    for(let i=0;i<this.puzzles.length;i++){
      if(nameObject==this.puzzles[i].data.Source ||
         nameObject==this.puzzles[i].data.Target){
           this.puzzles[i].resolvePuzzle();
           break;
      }
    }
  }

  start(){
    this.currentScene=0;
    this.changeScene(this.settings.MainScene);
  };

  resize() {
    var w = window.innerWidth * 0.95;
    var h = window.innerHeight * 0.95;
var ratio = Math.min( w/this.app.screen.width,  h/this.app.screen.height);
    //this part resizes the canvas but keeps ratio the same
  //  this.app.renderer.view.style.width = w + "px";
  //  this.app.renderer.view.style.height = h + "px";

    //this part adjusts the ratio:
    let scaleX;
    let scaleY;

    this.app.renderer.resize(w,h);
    this.app.stage.position.set(0,0);
    //this.app.stage.scale.set(ratio,ratio);
    this.app.stage.width=w;
    this.app.stage.height=h;
    //this.app.view.style.width=w;
    //this.app.stage.scale.set(ratio,ratio);

  }

};

export {Core};
