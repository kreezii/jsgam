import {game} from '../game.js';
import {TextButton} from './text.js';

export class Menu{
  constructor(){
    this.container=new PIXI.Container();
    this.newGame=new TextButton(game.settings.Text.NewGame[game.mainLanguage]);
    this.newGame.on('pointerup', StartAdventure);
    this.continue=new TextButton(game.settings.Text.Continue[game.mainLanguage]);
    this.options=new TextButton(game.settings.Text.Options[game.mainLanguage]);
    this.options.on('pointerup', ShowOptions);
    this.help=new TextButton(game.settings.Text.Help[game.mainLanguage]);
    this.credits=new TextButton(game.settings.Text.Credits[game.mainLanguage]);
    this.credits.on('pointerup', ShowCredits);

    //Values by default until save progress is implemented
    this.continue.alpha=0.5;
    this.continue.interactive=false;

    this.container.addChild(this.newGame);
    this.container.addChild(this.continue);
    this.container.addChild(this.options);
    this.container.addChild(this.help);
    this.container.addChild(this.credits);
    this.sortMenu();

    this.container.x = game.width / 2;
    this.container.y = game.height / 2;
    this.container.pivot.x = this.container.width / 2;
    this.container.pivot.y = this.container.height / 2;
  }

  sortMenu(){
    this.newGame.y=0;
    this.continue.y=this.newGame.y+this.newGame.height*1.5;
    this.options.y=this.continue.y+this.continue.height*1.5;
    this.help.y=this.options.y+this.options.height*1.5;
    this.credits.y=this.help.y+this.help.height*1.5;
  }

  update(){
    this.newGame.text=game.settings.Text.NewGame[game.mainLanguage];
    this.continue.text=game.settings.Text.Continue[game.mainLanguage];
    this.options.text=game.settings.Text.Options[game.mainLanguage];
    this.credits.text=game.settings.Text.Credits[game.mainLanguage];
  }

  hide(){
    this.container.visible=false;
  }

  show(){
    this.container.visible=true;
  }
}

function StartAdventure(){
  game.titleScreen.container.visible=false;
  //game.currentScene=0;
  PIXI.sound.stopAll();
  game.inventory.icon.visible=true;
  game.changeScene(game.settings.MainScene,game.settings.PlayerPosition);
}

function Continue(){

}

function ShowOptions(){

  game.titleScreen.menu.container.visible=false;
  game.titleScreen.options.container.visible=true;

}

function Help(){

}

function ShowCredits(){
  game.titleScreen.menu.hide();
  game.titleScreen.credits.show();

}
