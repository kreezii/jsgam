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
          if(text===undefined) text=this.game.activeObject.config.Description[0];
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
      this.stop();
    }
  }

  use(){
    this.lock=true;
    this.animate(this.animations.Use,1);
    this.sprite.once(this.event.COMPLETE, this.useEnd, this);
  }

  useEnd(){
    if(this.game.activePuzzle!==undefined && this.game.activePuzzle!==null && !this.game.activePuzzle.solved){
      this.game.activePuzzle.resolve();
    }else if(this.game.activeObject!==undefined && this.game.activeObject!==null) {
      if(this.game.activeObject.door){
        this.game.changeScene(this.game.activeObject.newScene,
          this.game.activeObject.playerPos);
        this.stop();
      }else{
        this.say(this.game.data.texts.NotUsable[this.game.activeLanguage])
      }
      this.game.activeObject.cancel();
    }
  }

  talk(){
    //Player must look in the right direction
    if(this.sprite.x<this.game.activeNPC.sprite.x){
      this.sprite.armature.flipX=false;
      //if(this.game.activeNPC.config.Mirror!==undefined) this.game.activeNPC.sprite.armature.flipX=true;
      if(this.game.activeNPC.config.Mirror) this.game.activeNPC.sprite.armature.flipX=true;
      else this.game.activeNPC.sprite.armature.flipX=false;
    }else{
      this.sprite.armature.flipX=true;
      //if(this.game.activeNPC.config.Mirror!==undefined) this.game.activeNPC.sprite.armature.flipX=false;
      if(this.game.activeNPC.config.Mirror) this.game.activeNPC.sprite.armature.flipX=false;
      else this.game.activeNPC.sprite.armature.flipX=true;
    }

    //Let's talk
    this.game.activeDialogue.start();
  }

}

export default Player;
