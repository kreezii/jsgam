import Character from './character.js';
import {closestPoint} from '../collisions.js';

class Player extends Character{
  setup(config){
    super.setup(config);

    //Hidden by default
    this.hide();
  }

  checkDirection(target){
    //Player must look in the right direction
    if(target.config.Area===undefined){
      if(this.sprite.x<target.sprite.x){
        this.sprite.armature.flipX=false;
      }else{
        this.sprite.armature.flipX=true;
      }
    }
  }

  say(text,voice){
    super.say(text,voice);
    //Lock the player
    this.lock=true;
  }

  look(){
    if(this.game.activeObject!==null){
      this.checkDirection(this.game.activeObject);
      let text=this.game.activeObject.config.Description[this.game.activeLanguage];
      if(text===undefined) text=this.game.activeObject.config.Description[0];
      let voice=undefined;
      if(this.game.activeObject.config.VoiceDescription!==undefined){
        voice=this.game.activeObject.config.VoiceDescription[this.game.activeLanguage];
        if(voice===undefined) voice=this.game.activeObject.config.VoiceDescription[0];
      }
      this.say(text,voice);
      this.game.activeObject.cancel();
    }else if(this.game.activeNPC!==null){
      this.checkDirection(this.game.activeNPC);
          let text=this.game.activeNPC.config.Description[this.game.activeLanguage];
          if(text===undefined) text=this.game.activeNPC.config.Description[0];
          this.say(text);
          this.game.activeNPC.cancel();
    }
  }

  take(){
    this.lock=true;
    this.animate(this.animations.Take,1);
    this.sprite.once(this.event.COMPLETE, this.takeEnd, this);
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
    }
    this.stand();
    this.unlock();
  }

  use(){
    if(this.game.activeObject){
      if(this.game.activeObject.config.Animation){
        this.lock=true;
        this.animate(this.game.activeObject.config.Animation,1);
        this.sprite.once(this.event.COMPLETE, this.useEnd, this);
      }else{
        this.useEnd();
      }
    }
  }

  useEnd(){
    if(this.game.activePuzzle!==undefined && this.game.activePuzzle!==null && !this.game.activePuzzle.solved){
      this.game.activePuzzle.resolve();
    }
    
    if(this.game.activeObject!==undefined && this.game.activeObject!==null) {
      if(this.game.activeObject.config.Door){
        this.game.changeScene(this.game.activeObject.config.Door.To,
          this.game.activeObject.config.Door.Player);
          this.stand();
      }else{
        if(this.game.activeObject.config.NotUsable) this.say(this.game.activeObject.config.NotUsable[this.game.activeLanguage]);
        else this.say(this.game.data.texts.NotUsable[this.game.activeLanguage]);
      }
      this.game.activeObject.cancel();
    }
  }

  talk(){
    //Check if we talk with the character
    if(this.game.activeDialogue!==null){
      //Player must look in the right direction
      if(this.sprite.x<this.game.activeNPC.sprite.x){
        this.sprite.armature.flipX=false;
        if(!this.game.activeNPC.sprite.armature.flipX) this.game.activeNPC.sprite.armature.flipX=true;
      }else{
        this.sprite.armature.flipX=true;
        if(this.game.activeNPC.sprite.armature.flipX) this.game.activeNPC.sprite.armature.flipX=false;
      }

      //Let's talk
      this.game.activeDialogue.start();
    }else{
      if(this.game.activeNPC.config.NotTalkable) this.say(this.game.activeNPC.config.NotTalkable[this.game.activeLanguage]);
      else this.say(this.game.data.texts.NotUsable[this.game.activeLanguage]);
      this.game.activeNPC.cancel();
    }
  }

}

export default Player;
