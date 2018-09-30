import {game} from '../game.js';
import {collision} from '../collisions.js';

export class Puzzle{
  constructor(data,index){
    this.data=data;
    this.index=index;
  }

  checkCollision(){
    let result;

    let source=game.objects[game.searchObject(this.data.Source)];
    let target=game.objects[game.searchObject(this.data.Target)];

    if(!this.data.Source) result=true;
    else result=collision(source,target) && target.parent.visible;

    return result;
  }

  resolvePuzzle(){
    let source=game.objects[game.searchObject(this.data.Source)];
    let target=game.objects[game.searchObject(this.data.Target)];

    if(this.data.Modify){
      if(this.data.Modify.Description) target.data.Description=this.data.Modify.Description;
      if(this.data.Modify.Door) this.createDoor(target)
    }

    if(this.data.Say){
      game.player.animate("speak",3);
      game.player.say(this.data.Say[game.mainLanguage]);
    }

    if(this.data.Destroy){
      game.inventory.remove(this.data.Source);
    }

    if(this.data.DestroyTarget){
      game.inventory.remove(this.data.Target);
    }

    if(this.data.Combine) this.createInventoryObject();

    if(this.data.Create){
      let objectIndex=game.searchObject(this.data.Create);
      //console.log(objectIndex)
      if(objectIndex){
        game.scenes[game.currentScene].container.addChild(game.objects[objectIndex]);}

        //console.log(game.scenes[game.currentScene].data.Name)
    }

  }

  createDoor(target){
    target.door=true;
    target.newScene=this.data.Modify.Door.To;
    target.playerPos=this.data.Modify.Door.Player;
    target.removeAllListeners();
    target.on('pointertap',onDoorTouch);
    target.use=ChangeRoom;
  }

  createInventoryObject(){
    game.objects[game.searchObject(this.data.Combine)].take();
  }
}
function onDoorTouch(event){
  game.player.action="use";
  if(!game.player.lock)
  {
    let moveTo={x:this.x,y:this.y};
    if(this.data.Area) moveTo=event.data.getLocalPosition(game.app.stage);
    game.player.lock=true;
    game.selectedObject=this.index;
    game.player.move(moveTo);
  }
}

function ChangeRoom(){
  game.changeScene(this.newScene,this.playerPos);
}
