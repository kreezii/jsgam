import {game,dbfactory} from '../game.js';

export class Character{
    constructor(data,index){
      dbfactory.parseDragonBonesData(game.resources[data.name+'Skeleton'].data);
      dbfactory.parseTextureAtlasData(game.resources[data.name+'Json'].data,game.resources[data.name+'Tex'].texture);
      this.sprite = dbfactory.buildArmatureDisplay(data.Name);
      this.tween=PIXI.tweenManager.createTween(this.sprite);
      this.sprite.data=data;
      this.sprite.index=index;
      this.sprite.animation.play(data.Animation);
      this.sprite.x=data.Position[0];
      this.sprite.y=data.Position[1];
      if(data.Size) this.sprite.scale.set(data.Size);
      this.sprite.parentLayer = game.layer;//Z-order
      this.sprite.interactive=true;
      this.sprite.buttonMode=true;
      this.sprite.on('pointertap',interactNPC);
    }

    say(textToSay){
      game.playerText.Text.text=textToSay;
      game.playerText.show();
      if(game.timeout) game.timeout.clear();
      game.timeout = PIXI.setTimeout(10,function(){game.playerText.hide();})
    }

};

function interactNPC(){
  if(!game.player.lock)
  {
    let moveTo={x:this.x,y:this.y};
    let bounds=this.getBounds();
    game.player.lock=true;
    if(this.data.Dialogue){
      game.player.action="talk";
      game.currentDialogue=game.dialogues[game.searchDialogue(this.data.Dialogue)];
    }else game.player.action="look";
    game.selectedCharacter=this.index;
    if(game.player.sprite.x<=this.x) moveTo.x = this.x-bounds.width;
    else if(game.player.sprite.x>this.x) moveTo.x = this.x+bounds.width;
    game.player.move(moveTo);
  }
}
