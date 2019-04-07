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

    //By default disabled
    this.continue.alpha=0.5;
    this.continue.interactive=false;

    this.container.addChild(this.newGame);
    this.container.addChild(this.continue);
    this.container.addChild(this.options);
    this.container.addChild(this.help);
    this.container.addChild(this.credits);
    this.sortMenu();
  }

  sortMenu(){
    this.newGame.y=0;
    this.continue.y=this.newGame.y+this.newGame.height*1.5;
    this.options.y=this.continue.y+this.continue.height*1.5;
    this.help.y=this.options.y+this.options.height*1.5;
    this.credits.y=this.help.y+this.help.height*1.5;

    this.newGame.x=this.container.width/2-this.newGame.width/2;
    this.continue.x=this.container.width/2-this.continue.width/2;
    this.options.x=this.container.width/2-this.options.width/2;
    this.help.x=this.container.width/2-this.help.width/2;
    this.credits.x=this.container.width/2-this.credits.width/2;

    this.center();
    this.resize();
  }

  update(){
    this.newGame.text=game.settings.Text.NewGame[game.mainLanguage];
    this.continue.text=game.settings.Text.Continue[game.mainLanguage];
    this.options.text=game.settings.Text.Options[game.mainLanguage];
    this.credits.text=game.settings.Text.Credits[game.mainLanguage];
    this.sortMenu();
  }

  resize(){
    let ratio = Math.min( game.width/this.container.width,  game.height/this.container.height);
    this.container.scale.set(ratio*0.95);
  }

  hide(){
    this.container.visible=false;
  }

  show(){
    this.container.visible=true;
  }

  enableContinue(){
    this.continue.alpha=1;
    this.continue.interactive=true;
    this.continue.on('pointerup',Continue);
    this.newGame.removeAllListeners();
    this.newGame.on('pointerup', Popup);
  }
  center(){
    this.container.x = game.width / 2;
    this.container.y = game.height / 2;
    this.container.pivot.x = this.container.width / 2;
    this.container.pivot.y = this.container.height / 2;
  }
}

export class Confirmation{
  constructor(){
    this.container=new PIXI.Container();
    this.container.visible=false;
    this.warning=new PIXI.Text(game.settings.Text.Warning[game.mainLanguage], game.settings.TextStyle);
    this.yes=new TextButton(game.settings.Text.Yes[game.mainLanguage]);
    this.yes.on('pointerup', StartAdventure);
    this.no=new TextButton(game.settings.Text.No[game.mainLanguage]);
    this.no.on('pointerup', BackMenu);
    this.container.addChild(this.warning);
    this.container.addChild(this.yes);
    this.container.addChild(this.no);
    this.sortMenu();

  }

  hide(){
    this.container.visible=false;
  }

  show(){
    this.container.visible=true;
  }

  update(){
    this.warning.text=game.settings.Text.Warning[game.mainLanguage];
    this.yes.text=game.settings.Text.Yes[game.mainLanguage];
    this.no.text=game.settings.Text.No[game.mainLanguage];
    this.sortMenu();
  }

  sortMenu(){
    this.warning.y=0;
    this.yes.y=this.warning.y+this.warning.height*1.5;
    this.no.y=this.yes.y+this.yes.height*1.5;

    this.warning.x=this.container.width/2-this.warning.width/2;
    this.yes.x=this.container.width/2-this.yes.width/2;
    this.no.x=this.container.width/2-this.no.width/2;
    this.center();
    this.resize();
  }

  resize(){
    let ratio = Math.min( game.width/this.container.width,  game.height/this.container.height);
    this.container.scale.set(ratio*0.95);
  }
  center(){
    this.container.x = game.width / 2;
    this.container.y = game.height / 2;
    this.container.pivot.x = this.container.width / 2;
    this.container.pivot.y = this.container.height / 2;
  }
}

function StartAdventure(){
  game.deleteAdventure();
  game.titleScreen.container.visible=false;
  PIXI.sound.stopAll();
  game.inventory.icon.visible=true;
  game.changeScene(game.settings.MainScene,game.settings.PlayerPosition);
}

function Continue(){
  game.loadAdventure();
  game.titleScreen.container.visible=false;
  PIXI.sound.stopAll();
  game.inventory.icon.visible=true;
  game.changeScene(game.scenes[game.currentScene].data.Name,game.progress.playerPos);
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

function Popup(){
  game.titleScreen.menu.hide();
  game.titleScreen.warning.show();
}

function BackMenu(){
  game.titleScreen.warning.hide();
  game.titleScreen.menu.show();
}
