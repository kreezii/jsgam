import Character from './character.js';
import dragonBones from 'dragonbones-pixi';
const dbEvents=dragonBones.dragonBones.EventObject;

class Player extends Character{
  move(coords){
    super.move(coords);
    this.game.activeState=this;
  }

  stop(){
    super.stop();
  //  if(this.game.activeObject) this.game.activeObject.cancel();
    if(this.lock) this.lock=false;
  }

  look(){
    if(this.game.activeObject){
      let text=this.game.activeObject.config.Description[this.game.activeLanguage];
      this.say(text);
      this.game.activeObject.cancel();
    }
  }

  take(){
    if(this.game.activeObject){
      this.lock=true;
      this.animate(this.animations.Take,1);
      this.sprite.once(dbEvents.COMPLETE, this.takeEnd, this);
    }
  }

  takeEnd(){
    this.stop();
    if(this.game.activeObject){
      this.game.inventory.add(this.game.activeObject.config.Name,this);
      this.game.activeObject.cancel();
    }
    this.lock=false;
  }

}

export default Player;
