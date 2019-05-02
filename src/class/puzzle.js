import {boxesIntersect,collision} from '../collisions.js';

class Puzzle{
  constructor(){
    this.solved=false;
  }

  resolve(){
    let source;
    if(this.config.Combine) source=this.game.objects[this.config.Combine];
  //  else if(this.config.Give) source=game.characters[this.config.Give];

    let target=this.game.objects[this.config.Target];

    if(this.config.Modify){
      if(this.config.Modify.Description) target.config.Description=this.config.Modify.Description;
      if(this.config.Modify.Door) this.createDoor(target)
    }

    if(this.config.Say && !this.game.silentMode){
      if(this.game.player.sprite.visible) this.game.player.say(this.config.Say[this.game.activeLanguage]);
    }

    //If the Combine isn't in inventory and we don't destroy it, we add it to the inventory
    if(this.config.Destroy===undefined && this.game.inventory.objects.includes(this.config.Combine)===false){
      this.game.inventory.add(this.config.Combine);
    }
    /*else if(this.config.NPCSay && !game.silentMode){
      game.selectedCharacter=game.searchCharacter(this.config.Give);
      game.characters[game.selectedCharacter].talk(this.config.NPCSay[game.mainLanguage]);
      if(game.player.sprite.visible) game.player.stand();
    }

    if(this.config.Destroy){
      game.inventory.remove(this.config.Target);
      target.hide();
    }

    if(this.config.DestroyAll){
      game.inventory.remove(this.config.Target);
      target.hide();
      game.inventory.remove(this.config.Combine);
      source.hide();
    }

    if(this.config.Get) this.createInventoryObject(this.config.Get);

    if(this.config.Create){
      let objectIndex=game.searchObject(this.config.Create);
      if(objectIndex){
        game.scenes[game.currentScene].container.addChild(game.objects[objectIndex]);}
    }
*/
    this.solved=true;
  }

  createDoor(target){
    target.door=true;
    target.newScene=this.config.Modify.Door.To;
    target.playerPos=this.config.Modify.Door.Player;
    target.sprite.removeAllListeners();
    target.sprite.on('pointertap',onDoorTouch);
    target.use=ChangeRoom;
  }

  createInventoryObject(objectName){
    this.game.objects[objectName].take();
  }
}
function onDoorTouch(event){
  if(!game.player.lock)
  {
    game.player.action="use";
    let moveTo={x:this.x,y:this.y};
    if(this.config.Area) moveTo=event.data.getLocalPosition(game.app.stage);
    game.player.lock=true;
    game.selectedObject=game.searchObject(this.config.Name);
    game.player.move(moveTo);
  }
}

function ChangeRoom(){
  game.changeScene(this.newScene,this.playerPos);
}

export default Puzzle;
