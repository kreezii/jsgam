import {game} from '../game.js';
import {collision} from '../collisions.js';

export class Puzzle{
  constructor(data){
    this.data=data;
    this.solved=false;
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
      if(game.player.sprite.visible) game.player.say(this.data.Say[game.mainLanguage]);
    }else{
      if(game.player.sprite.visible) game.player.stand();
    }

    if(this.data.Destroy){
      game.inventory.remove(this.data.Source);
      game.objects[game.searchObject(this.data.Source)].hide();
    }

    if(this.data.DestroyTarget){
      game.inventory.remove(this.data.Target);
      game.objects[game.searchObject(this.data.Target)].hide();
    }

    if(this.data.Combine) this.createInventoryObject(this.data.Combine);
    if(this.data.GiveItem) this.createInventoryObject(this.data.GiveItem);

    if(this.data.Create){
      let objectIndex=game.searchObject(this.data.Create);
      if(objectIndex){
        game.scenes[game.currentScene].container.addChild(game.objects[objectIndex]);}
    }
    this.solved=true;
  }

  createDoor(target){
    target.door=true;
    target.newScene=this.data.Modify.Door.To;
    target.playerPos=this.data.Modify.Door.Player;
    target.removeAllListeners();
    target.on('pointertap',onDoorTouch);
    target.use=ChangeRoom;
  }

  createInventoryObject(objectName){
    game.objects[game.searchObject(objectName)].take();
  }
}
function onDoorTouch(event){
  if(!game.player.lock)
  {
    game.player.action="use";
    let moveTo={x:this.x,y:this.y};
    if(this.data.Area) moveTo=event.data.getLocalPosition(game.app.stage);
    game.player.lock=true;
    game.selectedObject=game.searchObject(this.data.Name);
    game.player.move(moveTo);
  }
}

function ChangeRoom(){
  game.changeScene(this.newScene,this.playerPos);
}
