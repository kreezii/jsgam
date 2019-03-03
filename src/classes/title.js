import {game} from '../game.js';
import {TextButton} from './text.js';
import {Menu} from './menu.js';
import {Options} from './options.js';
import {CreditsScreen} from './credits.js';

export class TitleScreen{
  constructor(){
    this.container=new PIXI.Container();
    this.container.visible=false;
    this.menu=new Menu();
    this.options=new Options();
    this.credits=new CreditsScreen(game.creditsJSON);

    this.background=new PIXI.Sprite(PIXI.Texture.fromFrame(game.settings.TitleScreen.Background));

    this.container.addChild(this.background);
    this.container.addChild(this.menu.container);
    this.container.addChild(this.options.container);
  //  this.container.addChild(this.credits.container);
    game.app.stage.addChild(this.container);
  }

  show(){
    this.container.visible=true;
    PIXI.sound.play(game.settings.TitleScreen.Music,{loop:true});
  }

  hide(){
    this.container.visible=false;
  }
}
