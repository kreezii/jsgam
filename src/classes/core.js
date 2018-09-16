import * as filters from 'pixi-filters';

export class Core{
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
    this.currentPuzzle;
    this.selectedObject=null;
    this.inventory;
    this.inventoryBack="inventory-bg.png";
    this.inventoryIcon="inventory-icon.png";
    this.app=new PIXI.Application(width,height,{autoResize: true});
    this.OldFimFilter=new filters.OldFilmFilter();
    this.GodRayFilter=new filters.GodrayFilter();
    this.ReflectionFilter=new filters.ReflectionFilter({
      mirror:false,
      boundary:0,
      amplitude:[2,2],
      waveLength:[200,200]
    }
    );
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

    this.buttonTextStyle= new PIXI.TextStyle({
        dropShadowAngle: 0.5,
        dropShadowBlur: 3,
        dropShadowDistance: 0,
        fill: "white",
        fontSize: 32,
        fontVariant: "small-caps",
        fontWeight: "bold",
        lineJoin: "round",
        align: 'center',
        strokeThickness: 8
    });

    this.loadingText=new PIXI.Text("0 %", {
          fontFamily: 'Arial',
          fontSize: 35,
          fill: 'white',
          align: 'left'
    });
    this.playerText;
    /*
    this.textContainer=new PIXI.Container();
    this.textBackground=new PIXI.Sprite(PIXI.Texture.WHITE);
    this.textBackground.width=this.width;
    this.textBackground.height=this.height/3;
    this.textBackground.tint='black';
    this.textBackground.alpha=0.5;
    this.textContainer.addChild(this.textBackground);

    this.playerText=new PIXI.Text("sdvsvs", this.textStyle);
    this.playerText.position.set(0,0);
    this.textContainer.addChild(this.playerText);
    this.textContainer.visible=false;

    this.playerText.parentLayer = this.layerUI;
    this.playerText.anchor.set(0.5);
    this.playerText.visible=false;
    */
    //document.body.appendChild(this.app.view);

    document.body.appendChild(this.app.view);
    //document.getElementById('jsgam-canvas').appendChild(this.app.view);

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

  getCurrentScene(){
    return this.scenes[this.currentScene];
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
/*
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
*/
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

  checkFilters(){
    let activeFilters=this.scenes[this.currentScene].data.Filters;
    let filtersList=[];
    if(activeFilters=="Godray") filtersList.push(this.GodRayFilter);
    else if(activeFilters=="Reflection"){
      filtersList.push(this.ReflectionFilter);
    //  this.ReflectionFilter.boundary=0;
    //  this.ReflectionFilter.mirror=false;
    }
    return filtersList;
  }

  animateFilters(){
    this.GodRayFilter.time += this.app.ticker.elapsedMS / 1000;
    this.ReflectionFilter.time += 0.1;
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
        if(this.objects[this.selectedObject].use) this.objects[this.selectedObject].use();
        this.player.stand();
      }else if(animationProgress.isCompleted){
        this.player.stand();
      }
    }
    if(this.layer.filters != []) this.animateFilters();

    //Scale Player
    //let scalePlayer=this.player.sprite.y/this.app.screen.height*this.scenes[this.currentScene].playerSize;
    //this.player.sprite.scale.set(scalePlayer);

  }

  changeScene(sceneName,pos){
    this.player.action=null;
    let nextScene=this.searchScene(sceneName);
    this.scenes[this.currentScene].hide();
    this.scenes[nextScene].show();
    if(this.scenes[this.currentScene].data.Music!=undefined)PIXI.sound.stop(this.scenes[this.currentScene].data.Music);
    if(this.scenes[nextScene].data.Music!=undefined)
      PIXI.sound.play(this.scenes[nextScene].data.Music,{loop:true});
    this.currentScene=nextScene;
    if(pos){
      this.player.sprite.x=pos[0];
      this.player.sprite.y=pos[1];
      this.player.sprite.visible=this.scenes[this.currentScene].data.Player;
    }
    if(this.scenes[this.currentScene].data.Filters){
      this.layer.filters = this.checkFilters();
    }else{
      this.layer.filters = [];
    }
    //let inventoryOpt=this.scenes[this.currentScene].data.Inventory;
    //if(inventoryOpt) this.inventory.icon.visible=true;
  }

  checkPuzzle(nameObject){
    let found=false;
    for(let i=0;i<this.puzzles.length;i++){
      if(nameObject==this.puzzles[i].data.Source ||
         nameObject==this.puzzles[i].data.Target){
           //found=this.puzzles[i];
           //console.log(this.puzzles[i].checkCollision())
           if(this.puzzles[i].checkCollision()) found=this.puzzles[i];
           break;
      }
    }
    this.currentPuzzle=found;
  }

  //Show Logo Screen then the Title Screen
  start(){
    this.logoScreen.show();
  }

  resize() {
    var w = window.innerWidth * 0.95;
    var h = window.innerHeight * 0.95;
    var ratio = Math.min( w/this.width,  h/this.height);
    this.app.renderer.resize(w,h);
    this.app.stage.scale.set(ratio);

  }

}

//export {Core};*
