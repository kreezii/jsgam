import Character from './character.js';

class NPC extends Character{
  build(){
    if(this.config.Mirror!==undefined) this.sprite.armature.flipX=true;
    this.holding=false;
    this.pressTimeoutID;
    this.sprite.interactive=true;
    this.sprite.buttonMode=true;
    this.sprite.on('pointerdown', this.touch.bind(this))
        .on('pointerup', this.release.bind(this))
        .on('pointerupoutside', this.release.bind(this));
  }

  hold(){
    this.holding=true;
  }

  touch(event){
    if(this.game.activeNPC===null && !this.game.player.lock){
      this.game.activeNPC=this;
      this.action=null;
      this.interaction = event.data;
      if(this.pressTimeoutID) clearTimeout(this.pressTimeoutID);
      this.pressTimeoutID=setTimeout(this.hold.bind(this), this.game.holdTime);
    }
  }
  //Object drag/touch ends
  release(){
    if(this.pressTimeoutID) clearTimeout(this.pressTimeoutID);
    if(this.interaction){
      let distance=0;
      if(this.game.player.sprite.x<this.sprite.x) distance=this.sprite.getBounds().width*-1;
      else distance=this.sprite.getBounds().width;
      let moveTo={x:this.sprite.x+distance,y:this.sprite.y};

      if(this.interaction.button===2  || this.holding){
        //Check if we talk with the character
        if(this.config.Dialogue!==undefined){
          this.game.activeDialogue=this.game.dialogues[this.config.Dialogue];
          this.action="Talk";
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

  //Set player to look this object
  look(){
    this.action=this.game.player.look.bind(this.game.player);
  }

  //Object action is canceled or ended
  cancel(){
    this.game.activeNPC.action=null;
    this.game.activeNPC=null;

  }
}

export default NPC;
