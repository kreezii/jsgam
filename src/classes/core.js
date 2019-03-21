import * as filters from 'pixi-filters';
import localforage from 'localforage';

export class Core{
  constructor(width,height,objectID){
    this.files=[];
    this.logoScreen;
    this.titleScreen;
    this.scenes=[];
    this.cutscenes=[];
    this.objects=[];
    this.characters=[];
    this.dialogues=[];
    this.puzzles=[];
    this.sounds=[];
    this.settings=[];
    this.mainLanguage=0;
    this.timeout;
    this.playerJSON=[];
    this.scenesJSON=[];
    this.cutscenesJSON=[];
    this.objectsJSON=[];
    this.charactersJSON=[];
    this.dialoguesJSON=[];
    this.puzzlesJSON=[];
    this.creditsJSON=[];
    this.player={};
    this.playerTween;
    this.currentScene=null;
    this.currentCutscene=null;
    this.currentPuzzle=null;
    this.currentDialogue=null;
    this.selectedObject=null;
    this.selectedCharacter=null;
    this.inventory;
    this.inventoryBack;
    this.inventoryIcon;


    this.gameProgress={};

    this.app=new PIXI.Application(width,height,{autoResize: true,resolution: devicePixelRatio});
    this.OldFimFilter=new filters.OldFilmFilter();
    this.GodRayFilter=new filters.GodrayFilter();
    this.ReflectionFilter=new filters.ReflectionFilter({
      mirror:false,
      boundary:0,
      amplitude:[2,2],
      waveLength:[100,100]
    }
    );

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
    this.textField;

    document.body.appendChild(this.app.view);
    //document.getElementById('frame').appendChild(this.app.view);

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

  searchCutScene(nameScene){
    let numberScene;
    for(let i=0;i<this.cutscenes.length;i++){
      if(nameScene==this.cutscenes[i].data.Name){
        numberScene=i;
        break;
      }
    }
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

  searchDialogue(nameDialogue){
    let numberDialogue;
    for(let i=0;i<this.dialogues.length;i++){
      if(nameDialogue==this.dialogues[i].data.Name){
        numberDialogue=i;
        break;
      }
    }
    return numberDialogue;
  }

  searchCharacter(nameCharacter){
    let numberCharacter;
    for(let i=0;i<this.characters.length;i++){
      if(nameCharacter==this.characters[i].sprite.data.Name){

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

  //Game loop
  loop(){
    PIXI.tweenManager.update();
    let currentPlayerAnimation=this.player.sprite.animation.lastAnimationName;
    let animationProgress=this.player.sprite.animation.getState(currentPlayerAnimation);

    if(animationProgress!=null)
    {
      if(currentPlayerAnimation==this.player.animations.Take && animationProgress.isCompleted){
        this.objects[this.selectedObject].take();
        this.player.stand();
      }else if(currentPlayerAnimation==this.player.animations.Use && animationProgress.isCompleted){
        if(this.objects[this.selectedObject].use) this.objects[this.selectedObject].use();
        this.player.stand();
      }else if(currentPlayerAnimation==this.player.animations.Say && animationProgress.isCompleted){
        this.player.stand();
      }
    }

    if(this.layer.filters != []) this.animateFilters();

    //Scale Player
    //let scalePlayer=this.player.sprite.y/this.app.screen.height*this.scenes[this.currentScene].playerSize;
    //this.player.sprite.scale.set(scalePlayer);

  }

  //Change game scenes
  changeScene(sceneName,pos){
    let nextScene=this.searchScene(sceneName);

    if(nextScene!=this.currentScene)
    {
      if(this.currentScene!=null) this.scenes[this.currentScene].hide();
      this.currentScene=nextScene;
      this.saveGameProgress();
    }

    this.player.stand();
    if(pos){
      this.player.sprite.x=pos[0];
      this.player.sprite.y=pos[1];
    }

    if(this.scenes[this.currentScene].data.CutScene){
      //Hide Player & Inventory Icon
      if(this.player.sprite.visible)this.player.hide();
      this.inventory.hideIcon();

      //Show CutScene if it wasn't showed yet
      this.currentCutscene=this.searchCutScene(this.scenes[this.currentScene].data.CutScene);
      if(this.cutscenes[this.currentCutscene].played){
        this.currentCutscene=null;
        this.scenes[this.currentScene].show();
      }else{
        this.cutscenes[this.currentCutscene].show();
      }
    }else{
      this.scenes[this.currentScene].show();
    }

  }

  //Check if an object is part of a puzzle
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

  dialogueChoice(selected){
    this.currentDialogue.choice=selected;
    this.currentDialogue.data.Branches[this.currentDialogue.currentBranch].Choices[selected].clicked=true;
    this.currentDialogue.next();
  }

  //Show Logo Screen then the Title Screen
  start(){
    this.logoScreen.show();
  }

  saveGameProgress(){
    this.gameProgress.currentScene=this.currentScene;
    localforage.setItem('key', 'this.currentScene');
  //  console.log(this.gameProgress)
  //  console.log(localforage.getItem('key'))
  }

  //Resizes the game view
  resize() {
    var w = window.innerWidth * 0.95;
    var h = window.innerHeight * 0.95;

    var ratio = Math.min( w/this.width,  h/this.height);
    this.app.renderer.resize(this.width*ratio,this.height*ratio);
    this.app.stage.scale.set(ratio);
  }

}
