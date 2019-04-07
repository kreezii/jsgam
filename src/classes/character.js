import {game,dbfactory} from '../game.js';

export class Character{
    constructor(data){
      dbfactory.parseDragonBonesData(PIXI.loader.resources[data.Name+'Skeleton'].data);
      dbfactory.parseTextureAtlasData(PIXI.loader.resources[data.Name+'Json'].data,PIXI.loader.resources[data.Name+'Tex'].texture);
      this.sprite = dbfactory.buildArmatureDisplay(data.Name);
      this.tween=PIXI.tweenManager.createTween(this.sprite);
      this.sprite.data=data;
      this.sprite.animation.play(data.Animations.Stand);
      this.sprite.x=data.Position[0];
      this.sprite.y=data.Position[1];
      if(data.Size) this.sprite.scale.set(data.Size);
      this.sprite.parentLayer = game.layer;//Z-order
      this.sprite.interactive=true;
      this.sprite.buttonMode=true;
      this.sprite.on('pointertap',interactNPC);
    }

    say(textToSay){
      game.textField.CharacterPic.texture=PIXI.Texture.from(this.sprite.data.Avatar);
      game.textField.showAvatar();
      game.textField.Field.tint=game.settings.ColorNPC;
      game.textField.Field.text=textToSay;
      this.animate(this.sprite.data.Animations.Say);
      game.textField.show();
    }

    //Same as say function but shows some text and hide the text box
    talk(textToSay){
      this.say(textToSay);
      if(game.timeout) game.timeout.clear();
      game.timeout = PIXI.setTimeout(game.settings.Text.Timeout,SayTalk);
    }

    stand(){
      this.animate(this.sprite.data.Animations.Stand);
    }

    animate(animation,times){
      this.sprite.animation.fadeIn(animation,0.25,times);
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
    game.selectedCharacter=game.searchCharacter(this.data.Name);
    if(game.player.sprite.x<=this.x) moveTo.x = this.x-bounds.width;
    else if(game.player.sprite.x>this.x) moveTo.x = this.x+bounds.width;
    game.player.move(moveTo);
  }
}

function SayTalk(){
  if(game.selectedCharacter!=null) game.characters[game.selectedCharacter].stand();
  if(game.player.lock) game.player.stand();
  game.timeout.clear();
  game.timeout=null;
  game.textField.hide();
  game.selectedCharacter=null;
}
