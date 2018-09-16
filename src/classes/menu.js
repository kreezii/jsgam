import {game} from '../game.js';

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

class TextButton extends PIXI.Text{
    constructor(text,posV){
      super(text,game.buttonTextStyle);
      this.interactive=true;
      this.buttonMode=true;
      this.anchor.set(0.5);
      this.x=this.width/2;
      this.y=posV*this.height*1.5;
    }
}

export class TitleScreen{
  constructor(){
    this.container=new PIXI.Container();
    this.container.visible=false;
    this.buttonContainer=new PIXI.Container();
    this.optionsContainer=new PIXI.Container();
    this.creditsContainer=new PIXI.Container();

    this.background=new PIXI.Sprite(PIXI.Texture.fromFrame(game.settings.TittleScreenBackground));
    this.newGame=new TextButton(game.settings.TextNewGame[game.mainLanguage],0);
    this.continue=new TextButton(game.settings.TextContinue[game.mainLanguage],1);
    this.options=new TextButton(game.settings.TextOptions[game.mainLanguage],2);
    this.credits=new TextButton(game.settings.TextCredits[game.mainLanguage],3);
    this.buttonContainer.addChild(this.newGame);
    this.buttonContainer.addChild(this.continue);
    this.buttonContainer.addChild(this.options);
    this.buttonContainer.addChild(this.credits);
    this.buttonContainer.x = game.width / 2;
    this.buttonContainer.y = game.height / 2;
    this.buttonContainer.pivot.x = this.buttonContainer.width / 2;
    this.buttonContainer.pivot.y = this.buttonContainer.height / 2;

    this.newGame.on('pointerup', StartAdventure);
    this.options.on('pointerup', ShowOptions);
    this.container.addChild(this.background);
    this.container.addChild(this.buttonContainer);
    game.app.stage.addChild(this.container);
    game.app.stage.addChild(this.optionsContainer);
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

  game.titleScreen.buttonContainer.visible=false;
  game.titleScreen.optionsContainer.visible=true;

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
