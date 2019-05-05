class Puzzle{
  constructor(){
    this.solved=false;
  }

  resolve(){
    this.game.activeObject.cancel();

    if(this.config.Modify){
      let objectMod=this.game.objects[this.config.Modify.Name]
      if(this.config.Modify.Description) objectMod.config.Description=this.config.Modify.Description;
      if(this.config.Modify.Door) this.createDoor(objectMod)
    }

    if(this.config.Say && !this.game.silentMode){
      this.game.player.say(this.config.Say[this.game.activeLanguage]);
    }else{
      this.game.player.stop();
    }

    /*else if(this.config.NPCSay && !game.silentMode){
      game.selectedCharacter=game.searchCharacter(this.config.Give);
      game.characters[game.selectedCharacter].talk(this.config.NPCSay[game.mainLanguage]);
      if(game.player.sprite.visible) game.player.stand();
    }
*/
    if(this.config.Remove!==undefined){
      let i;
      let array=this.config.Remove;
      for(i=0;i<array.length;i++){
        this.game.objects[array[i]].remove();
      }
    }
/*
    if(this.config.Get) this.createInventoryObject(this.config.Get);

    if(this.config.Create){
      let objectIndex=game.searchObject(this.config.Create);
      if(objectIndex){
        game.scenes[game.currentScene].container.addChild(game.objects[objectIndex]);}
    }
*/
    this.solved=true;
    this.game.activePuzzle=null;
  }

  createDoor(target){
    target.door=true;
    target.newScene=this.config.Modify.Door.To;
    target.playerPos=this.config.Modify.Door.Player;
  }

  createInventoryObject(objectName){
    //this.game.objects[objectName].take();
  }
}

export default Puzzle;
