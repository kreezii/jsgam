import {game} from '../game.js';
import {collision} from './utils.js';

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

    if(this.data.Say) game.player.say(this.data.Say[game.mainLanguage]);

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
    target.on('pointerup',onDoorTouch);
    target.use=Goto;
  }

  createInventoryObject(){
    game.objects[game.searchObject(this.data.Combine)].take();
  }
}
function onDoorTouch(){
  game.player.action="use";
}

function Goto(){
  game.changeScene(this.newScene,this.playerPos);
}
