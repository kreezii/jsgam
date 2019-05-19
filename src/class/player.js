import Character from './character.js';
import dragonBones from 'dragonbones-pixi';
const dbEvents=dragonBones.dragonBones.EventObject;

class Player extends Character{
  move(coords){
    super.move(coords);
    this.game.activeState=this;
  }
  say(text){
    super.say(text);
    //Lock the player
    this.lock=true;
  }
  look(){
    if(this.game.activeObject!==null){
      let text=this.game.activeObject.config.Description[this.game.activeLanguage];
      this.say(text);
      this.game.activeObject.cancel();
    }
  }

  take(){
    this.lock=true;
    this.animate(this.animations.Take,1);
    this.sprite.once(dbEvents.COMPLETE, this.takeEnd, this);
  }

  takeEnd(){
    if(this.game.activeObject!==null){
      let name=this.game.activeObject.config.Name;
      if(this.game.activeScene!==null){
        if(this.game.activeScene.config.Objects.includes(name)){
          let tmpIndex=this.game.activeScene.config.Objects.indexOf(name);
          this.game.activeScene.config.Objects.splice(tmpIndex,1);
        }
      }
      this.game.inventory.add(name);
      this.game.activeObject.cancel();
      this.stop();
    }
  }

  use(){
    this.lock=true;
    this.animate(this.animations.Use,1);
    this.sprite.once(dbEvents.COMPLETE, this.useEnd, this);
  }

  useEnd(){
    if(this.game.activePuzzle!==null){
      this.game.activePuzzle.resolve();
    }else if(this.game.activeObject!==null) {
      if(this.game.activeObject.door){
        this.game.setScene(this.game.activeObject.newScene,this.game.activeObject.playerPos);
        this.stop();
      }else{
        this.say(this.game.data.texts.NotUsable[this.game.activeLanguage])
      }
      this.game.activeObject.cancel();
    }

  }

  talk(){
    this.game.activeDialogue.start();
  }

}

export default Player;
