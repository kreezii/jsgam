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
      this.game.inventory.add(this.game.activeObject.config.Name);
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
    this.say(this.game.activeNPC.config.Name)
    this.game.activeNPC.cancel();
  }

}

export default Player;
