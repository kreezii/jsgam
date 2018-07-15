import {game} from '../game.js';

export function resolvePuzzle(origin,target){
  let source=origin.usable;

  if(source.Modify){
    if(source.Modify.Description) target.description=source.Description;
    if(source.Modify.Door) createDoor(source.Modify,target)
  }

  if(source.Say) game.player.say(source.Say[game.mainLanguage]);

  if(source.Destroy){
    game.inventory.remove(origin.name);
    setTimeout(function(){ origin.destroy();}, 50);
  }

  if(source.DestroyTarget){
    if(game.inventory.searchObject(target.name)) game.inventory.remove(target.name);
    setTimeout(function(){ target.destroy();}, 50);
  }

  if(source.Combine) createInventoryObject(source.Combine);
}

function createDoor(source,target){
  target.door=true;
  target.newScene=source.Door.To;
  target.playerPos=source.Door.Player;
  target.use=function(){game.goScene(target.newScene,target.playerPos)};
}

function createInventoryObject(newInventory){
  game.objects[game.searchObject(newInventory)].take();
}
