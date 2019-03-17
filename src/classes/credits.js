import {game} from '../game.js';
import {TextButton} from './text.js';
import MultiStyleText from "pixi-multistyle-text";

export class CreditsScreen{
  constructor(){
    this.container=new PIXI.Container();
    this.container.visible=false;
    this.container.interactive=true;
    this.container.buttonMode=true;
    this.container.on('pointerup', GotoMenu);

    this.buildText();
    if(game.creditsJSON.Background!=undefined) this.background=new PIXI.Sprite(PIXI.Texture.from(game.creditsJSON.Background));

    this.structuredText = new MultiStyleText(this.text,game.creditsJSON.Style);

    this.container.addChild(this.structuredText);

    this.container.x = game.width / 2;
    this.container.y = game.height;
    this.container.pivot.x = this.container.width / 2;
    //this.container.pivot.y = this.container.height / 2;

    this.tween = PIXI.tweenManager.createTween(this.container);
    this.tween
      .from({ y: game.height})
      .to({ y: 0 - this.container.height});
    this.tween.time = 20000;
    this.tween.on("end", GotoMenu);
  }

  show(){
    this.tween.start();
    this.container.visible=true;
    //PIXI.sound.play(game.settings.TitleScreen.Music,{loop:true});
  }

  hide(){
    this.tween.reset();
    this.container.visible=false;
  }

  buildText(){
    this.text="";
    let i;
    for (i=0; i < game.creditsJSON.Lines.length; i++) {
    this.text +="<title>";
    this.text += game.creditsJSON.Lines[i].Title[game.mainLanguage];
    this.text +="</title>";
    this.text += "\n";
    let j;

    for (j = 0; j < game.creditsJSON.Lines[i].Text.length; j++) {
      this.text += game.creditsJSON.Lines[i].Text[j];
      this.text += "\n";
    }
    this.text += "\n";
    }
  }

  update(){
    this.buildText();
    this.structuredText.text=this.text;
  }
}

function GotoMenu(){
  game.titleScreen.credits.hide();
  game.titleScreen.menu.show();
}
