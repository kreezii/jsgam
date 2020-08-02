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
      let distance=this.width();
      if(this.game.player.sprite.x<this.sprite.x) distance*=-1;
    /*  if(this.game.player.sprite.x<this.sprite.x) distance=this.sprite.getBounds().width*-1;
      else distance=this.sprite.getBounds().width+this.game.player.sprite;*/
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

  add(scene){
    this.game.scenes[scene].container.addChild(this.sprite);
    if(this.game.scenes[scene].config.Characters!==undefined) this.game.scenes[scene].config.Characters.push(this.config.Name);
    else this.game.scenes[scene].config.Characters=[this.config.Name];

  }

  remove(){
    let currentParent=this.sprite.parent;
    currentParent.removeChild(this.sprite);

    //Remove from scene
    let scenesArray=Object.values(this.game.scenes)
    let i;
    let scenesLength=scenesArray.length;
    for(i=0;i<scenesLength;i++){
      if(scenesArray[i].config.Characters!==undefined && scenesArray[i].config.Characters.includes(this.config.Name)){
        let tmpIndex=scenesArray[i].config.Characters.indexOf(this.config.Name);
        scenesArray[i].config.Characters.splice(tmpIndex,1);
      }
    }
  }

  setScene(sceneName){
    this.game.scenes[sceneName].container.addChild(this.sprite);
  }
}

export default NPC;
