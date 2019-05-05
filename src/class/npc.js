import Character from './character.js';

class NPC extends Character{
  build(){
    this.sprite.interactive=true;
    this.sprite.buttonMode=true;
    this.sprite.on('pointerdown', this.touch.bind(this))
        .on('pointerup', this.release.bind(this))
        .on('pointerupoutside', this.release.bind(this));
  }

  touch(event){
    if(this.game.activeNPC===null && !this.game.player.lock){
      this.game.activeNPC=this;
      this.action=null;
      this.interaction = event.data;
    }
  }
  //Object drag/touch ends
  release(){

    if(this.interaction){
      let distance=0;
      if(this.game.player.sprite.x<this.sprite.x) distance=this.sprite.width*-1;
      else distance=this.sprite.width;
      let moveTo={x:this.sprite.x+distance,y:this.sprite.y};
      //Check if we take it
      if(this.config.Dialogue!==undefined){
        this.action=this.game.player.talk.bind(this.game.player);
      }

      if(this.action!==null){
        this.game.player.tween.once('end',this.action);
        this.game.player.move(moveTo);
      }else{
        this.cancel();
      }

      this.interaction = null;
      this.dragging = false;
      this.moved=0;
    }
  }
  //Object action is canceled or ended
  cancel(){
    this.game.activeNPC.action=null;
    this.game.activeNPC=null;

  }
}

export default NPC;
