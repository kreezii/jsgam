import NPC from './npc.js';

class Partner extends NPC{
  build(){
    super.build();
    this.hide();
  }

  show(){
    super.show();
    let newConfig=this.game.activeScene.config.Partner;
    if(newConfig.Size) this.sprite.scale.set(newConfig.Size);
    if(newConfig.Position){
      this.sprite.x=newConfig.Position[0];
      this.sprite.y=newConfig.Position[1];
    }
    if(newConfig.Mirror) this.sprite.armature.flipX=true;
    else this.sprite.armature.flipX=false;
  }

  release(){
    if(this.pressTimeoutID) clearTimeout(this.pressTimeoutID);
    if(this.interaction){
      let distance=this.width()*2;
      if(this.game.player.sprite.x<this.sprite.x) distance*=-1;
      let moveTo={x:this.sprite.x+distance,y:this.sprite.y};

      if(this.interaction.button===2  || this.holding){
        this.action="Talk";
        //Check if we talk with the character
        if(this.game.activeScene.config.Partner.Dialogue){
          this.game.activeDialogue=this.game.dialogues[this.game.activeScene.config.Partner.Dialogue];
        }else if(this.config.Dialogue!==undefined){
          this.game.activeDialogue=this.game.dialogues[this.config.Dialogue];
        }
      }else{
        this.action="Look";
      }

      if(this.action!==null){
        this.game.player.endAction=this.action;
        this.game.player.move(moveTo);
      }else{
        this.cancel();
      }

      if(this.game.player.touched) this.game.player.touched=false;

      this.holding=false;
      this.interaction = null;
      this.dragging = false;
      this.moved=0;
    }
  }
}

export default Partner;
