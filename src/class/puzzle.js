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
          if(objectProperty.Door!==undefined) objectMod.config.Door=objectProperty.Door;
          if(objectProperty.Take!==undefined) objectMod.config.Take=objectProperty.Take;
          if(objectProperty.Position!==undefined) objectMod.setpos(objectProperty.Position[0],objectProperty.Position[1]);
          if(objectProperty.Mirror) objectMod.flip();
          if(objectProperty.Interactive!==undefined) objectMod.setInteraction(objectProperty.Interactive);
          if(objectProperty.Texture!==undefined) this.changeTexture(objectProperty.Texture);
          if(objectProperty.Combine!==undefined) objectMod.config.Combine=objectProperty.Combine;
          if(objectProperty.Use!==undefined) objectMod.config.Use=objectProperty.Use;
          if(objectProperty.Lock!==undefined) objectMod.config.Lock=objectProperty.Lock;
        }

        if(this.config.Modify.Player){
          let playerMod=this.config.Modify.Player;

          if(playerMod.Position!==undefined){
            this.player.sprite.x=playerMod.Position[0];
            this.player.sprite.y=playerMod.Position[1];
          }

          if(playerMod.Skin){
            this.game.player.changeSkin(playerMod.Skin);
          }
        }

        if(this.config.Modify.Scene){
          let sceneMod=this.config.Modify.Scene;
          if(this.config.Modify.Scene.WalkArea){
            this.game.scenes[sceneMod.Name].walkable.deleteObstacle(this.game.scenes[sceneMod.Name].polyWalk);
            this.game.scenes[sceneMod.Name].config.WalkArea=sceneMod.WalkArea;
            this.game.scenes[sceneMod.Name].walkable.addPolygon(sceneMod.WalkArea);
          }
        }

        if(this.config.Modify.NPC){
          let npcMod=this.config.Modify.NPC;

          if(npcMod.Description!==undefined) this.game.npcs[npcMod.Name].config.Description=npcMod.Description;

          if(npcMod.Dialogue!==undefined){
            this.game.npcs[npcMod.Name].config.Dialogue=npcMod.Dialogue;
          }

          if(npcMod.Position!==undefined){
            this.game.npcs[npcMod.Name].sprite.x=npcMod.Position[0];
            this.game.npcs[npcMod.Name].sprite.y=npcMod.Position[1];
          }

          if(npcMod.Skin){
            this.game.npcs[npcMod.Name].changeSkin(npcMod.Skin);
          }

          if(npcMod.Scene){
            this.game.npcs[npcMod.Name].setScene(npcMod.Scene);
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

        if(this.config.Remove.NPC){
          let npcRemove=this.game.npc[this.config.Remove.NPC];
          npcRemove.remove();
        }

        if(this.config.Remove.Partner){
          this.game.partner=null;
        }
      }

      if(this.config.Resolve!==undefined)this.game.puzzles[this.config.Resolve].resolve();

      if(this.config.Say && !this.game.silentMode){
        let text=this.config.Say[this.game.activeLanguage];
        if(text===undefined) text=this.config.Say[0];
        this.game.player.say(text);
      }else if(this.config.NPCSay && !this.game.silentMode){
        let text=this.config.NPCSay.Text[this.game.activeLanguage];
        if(text===undefined) text=this.config.NPCSay.Text[0];
        this.game.npcs[this.config.NPCSay.Name].say(text);
      }else{
        this.game.player.stand();
        this.game.player.unlock();
      }

      if(this.config.Sound!==undefined && !this.game.silentMode){
          if(this.config.Sound.Sprite!==undefined) this.game.sounds[this.config.Sound.Name].play(null,this.config.Sound.Sprite);
          else this.game.sounds[this.config.Sound.Name].play();
      }

      if(this.config.CutScene!==undefined && !this.game.silentMode){
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
      this.game.player.stand();
      this.game.player.unlock();
    }

    this.game.activePuzzle=null;
  }
}

export default Puzzle;
