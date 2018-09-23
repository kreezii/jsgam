import {game} from '../game.js';
import {TextButton} from './text.js';

export class LogoScreen{
  constructor(){
    this.container=new PIXI.Container();
    this.container.visible=false;
    this.logo=new PIXI.Sprite(PIXI.Texture.fromFrame(game.settings.Logo));
    this.logo.alpha=0;
    this.logo.anchor.set(0.5);
    this.logo.x=game.width/2;
    this.logo.y=game.height/2;
    this.container.addChild(this.logo);
    this.ticker=new PIXI.ticker.Ticker();
    this.ticker.add(FadeIn);
    this.logo.interactive=true;
    this.logo.on('pointerup', SkipLogo);
    game.app.stage.addChild(this.container);
  }
  show(){
    this.ticker.start();
    this.container.visible=true;
  }

  hide(){
    this.container.visible=false;
  }
}

export class TitleScreen{
  constructor(){
    this.container=new PIXI.Container();
    this.container.visible=false;
    this.menuContainer=new PIXI.Container();
    this.optionsContainer=new PIXI.Container();
    this.optionsContainer.visible=false;
    this.creditsContainer=new PIXI.Container();

    this.background=new PIXI.Sprite(PIXI.Texture.fromFrame(game.settings.TittleScreenBackground));
    this.newGame=new TextButton(game.settings.TextNewGame[game.mainLanguage],0);
    this.newGame.on('pointerup', StartAdventure);
    this.continue=new TextButton(game.settings.TextContinue[game.mainLanguage],1);
    this.options=new TextButton(game.settings.TextOptions[game.mainLanguage],2);
    this.options.on('pointerup', ShowOptions);
    this.credits=new TextButton(game.settings.TextCredits[game.mainLanguage],3);

    this.languages=[];
    for(let i=0;i<game.settings.Languages.length;i++){
      this.languages[i]=new TextButton(game.settings.Languages[i],i);
      this.languages[i].alpha=0.5;
      this.languages[i].on('pointerup', SelectLanguage);
      this.optionsContainer.addChild(this.languages[i]);
    }
    this.languages[game.mainLanguage].alpha=1.0;
    this.backButton=new TextButton(game.settings.Back[game.mainLanguage],this.languages.length);
    this.backButton.on('pointerup', Back);
    this.optionsContainer.addChild(this.backButton);

    this.optionsContainer.x = game.width / 2;
    this.optionsContainer.y = game.height / 2;
    this.optionsContainer.pivot.x = this.optionsContainer.width / 2;
    this.optionsContainer.pivot.y = this.optionsContainer.height / 2;

    this.menuContainer.addChild(this.newGame);
    this.menuContainer.addChild(this.continue);
    this.menuContainer.addChild(this.options);
    this.menuContainer.addChild(this.credits);
    this.menuContainer.x = game.width / 2;
    this.menuContainer.y = game.height / 2;
    this.menuContainer.pivot.x = this.menuContainer.width / 2;
    this.menuContainer.pivot.y = this.menuContainer.height / 2;

    this.container.addChild(this.background);
    this.container.addChild(this.menuContainer);
    this.container.addChild(this.optionsContainer);
    game.app.stage.addChild(this.container);
  }

  show(){
    this.container.visible=true;
    PIXI.sound.play(game.settings.TittleScreenMusic,{loop:true});
  }

  hide(){
    this.container.visible=false;
  }
}

function StartAdventure(){
  game.titleScreen.container.visible=false;
  game.currentScene=0;
  PIXI.sound.stopAll();
  game.inventory.icon.visible=true;
  game.changeScene(game.settings.MainScene,game.settings.PlayerPosition);
}

function ShowOptions(){

  game.titleScreen.menuContainer.visible=false;
  game.titleScreen.optionsContainer.visible=true;

}

function SelectLanguage(){
  let selected=game.settings.Languages.indexOf(this.text);
  if(selected!=-1){
    game.titleScreen.languages[game.mainLanguage].alpha=0.5;
    this.alpha=1.0;
    game.mainLanguage=game.settings.Languages.indexOf(this.text);
    UpdateMenu();
  }

}

function UpdateMenu(){
  game.titleScreen.newGame.text=game.settings.TextNewGame[game.mainLanguage];
  game.titleScreen.continue.text=game.settings.TextContinue[game.mainLanguage];
  game.titleScreen.options.text=game.settings.TextOptions[game.mainLanguage];
  game.titleScreen.credits.text=game.settings.TextCredits[game.mainLanguage];
}

function Back(){
  game.titleScreen.menuContainer.visible=true;
  game.titleScreen.optionsContainer.visible=false;
}

function FadeIn(){
  game.logoScreen.logo.alpha+=0.01;

  if(game.logoScreen.logo.alpha>1){
    game.logoScreen.ticker.stop();
    game.logoScreen.ticker.remove(FadeIn);
    game.logoScreen.ticker.add(FadeOut);
    game.timeout = PIXI.setTimeout(3,function(){game.logoScreen.ticker.start();})
  }
}

function FadeOut(){
  game.logoScreen.logo.alpha-=0.01;

  if(game.logoScreen.logo.alpha<0){
      SkipLogo();
  }
}

function SkipLogo(){
  game.logoScreen.hide();
  if(game.logoScreen.ticker) game.logoScreen.ticker.destroy();
  if(game.timeout) game.timeout.clear();
  game.titleScreen.show();
}
