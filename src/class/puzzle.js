class Puzzle{
  constructor(){
    this.solved=false;
  }

  resolve(){
    if(this.game.activeObject!==null) this.game.activeObject.cancel();

    if(!this.solved){
      if(this.config.Modify){
        if(this.config.Modify.Object){
          let objectMod=this.game.objects[this.config.Modify.Object.Name];
          let objectProperty=this.config.Modify.Object;

          if(objectProperty.Description!==undefined) objectMod.config.Description=objectProperty.Description;
          if(objectProperty.Door!==undefined) this.setDoor(objectMod);
          if(objectProperty.Position!==undefined) objectMod.setpos(objectProperty.Position[0],objectProperty.Position[1]);
          if(objectProperty.Mirror) objectMod.flip();
          if(objectProperty.Interactive!==undefined) this.setInteraction(objectProperty.Interactive);
          if(objectProperty.Texture!==undefined) this.changeTexture(objectProperty.Texture);
          if(objectProperty.Combine!==undefined) objectMod.config.Combine=objectProperty.Combine;
          if(objectProperty.Use!==undefined) objectMod.config.Use=objectProperty.Use;
          if(objectProperty.Lock!==undefined) objectMod.lock=objectProperty.Lock;
        }

        if(this.config.Modify.Player){

        }

        if(this.config.Modify.NPC){
          if(this.config.Modify.NPC.Dialogue!==undefined){
            let NPCProperty=this.config.Modify.NPC.Dialogue;
            this.game.npcs[NPCProperty.Character].config.Dialogue=NPCProperty.Name;
          }
        }
      }

      if(this.config.Add){
        if(this.config.Add.Object){
          let objectAdd=this.game.objects[this.config.Add.Object.Name];
          objectAdd.add(this.config.Add.Object.Scene);
        }

        if(this.config.Add.Inventory!==undefined){
          this.game.inventory.add(this.config.Add.Inventory);
        }

        if(this.config.Add.NPC!==undefined){
          let npcAdd=this.game.npcs[this.config.Add.NPC.Name];
          npcAdd.add(this.config.Add.NPC.Scene);
        }
      }

      if(this.config.Remove){
        if(this.config.Remove.Object){
          let objectRemove=this.game.objects[this.config.Remove.Object];
          objectRemove.remove();
        }

        if(this.config.Remove.Door!==undefined){
          let objectDoor=this.game.objects[this.config.Remove.Door];
          objectDoor.door=false;
        }
        if(this.config.Remove.NPC){
          let npcRemove=this.game.npc[this.config.Remove.NPC];
          npcRemove.remove();
        }
      }

      if(this.config.Resolve!==undefined)this.game.puzzles[this.config.Resolve].resolve();

      if(this.config.Say && !this.game.silentMode){
        this.game.player.say(this.config.Say[this.game.activeLanguage]);
      }else if(this.config.NPCSay && !this.game.silentMode){
        this.game.npcs[this.config.NPCSay.Name].say(this.config.NPCSay.Text[this.game.activeLanguage]);
      }else{
        this.game.player.stop();
      }

      if(this.config.Sound!==undefined && !this.game.silentMode){
          if(this.config.Sound.Source!==undefined) this.game.sounds[this.config.Sound.Name].play(null,this.config.Sound.Source);
          else this.game.sounds[this.config.Sound.Name].play();
      }

      if(this.config.CutScene!==undefined && !this.game.silentMode && this.game.playSounds){
        this.game.activeCutscene=this.game.cutscenes[this.config.CutScene];
        this.game.pause();
        this.game.activeCutscene.show();
      }

      if(this.config.EndGame!==undefined && !this.game.silentMode){
        this.game.end();
        if(this.config.EndGame.CutScene!==undefined){
           this.game.activeCutscene=this.game.cutscenes[this.config.EndGame.CutScene];
           this.game.pause();
           this.game.activeCutscene.show();
        }
        else this.game.home();
      }

      this.solved=true;

    }else{
      this.game.player.stop();
    }

    this.game.activePuzzle=null;
  }

  setDoor(target){
    if(this.config.Modify.Object.Door===false){
      target.door=false;
    }else{
      target.door=true;
      target.newScene=this.config.Modify.Object.Door.To;
      target.playerPos=this.config.Modify.Object.Door.Player;
    }
  }
}

export default Puzzle;
