import {game} from '../game.js';

export class LogoScreen{
  constructor(){
    this.container=new PIXI.Container();
    this.container.visible=false;
    this.logo=new PIXI.Sprite(PIXI.Texture.from(game.settings.Logo));
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
