import {game} from '../game.js';
import {gameObject} from './objects.js';
var Walkable=require('walkable');

export class gameScene{
  constructor(data,index){
    this.data=data;
    this.index=index;
    this.container=new PIXI.Container();
    this.container.visible=false;
    this.background=new PIXI.Sprite(PIXI.Texture.fromFrame(data.Background));
    //this.background.width=game.app.screen.width;
    //this.background.height=game.app.screen.height;
    this.background.parentLayer = game.layer;//Z-order
    if(data.Player){
      this.background.interactive=true;
      this.background.buttonMode=true;
      this.background.on('pointerup',movePlayer);

    //  this.walkable=new Walkable(game.app.screen.width,game.app.screen.height);
    this.walkable=new Walkable(game.width,game.height);
      if(data.WalkArea!=undefined){
        this.walkable.addPolygon(data.WalkArea);
      }

      if(data.Obstacles!=undefined){
        let obstacles=Object.values(data.Obstacles);
        this.data.Obstacles=obstacles;
        for(let i=0;i<this.data.Obstacles.length;i++){
          this.walkable.addPolygon(this.data.Obstacles[i]);
        }
      }
    }

    this.container.addChild(this.background);

    let sceneObjects=data.Objects;
    if(sceneObjects){
      for(let i=0;i<sceneObjects.length;i++){
        let objectIndex=game.searchObject(sceneObjects[i]);
        if(objectIndex!=undefined){
          this.container.addChild(game.objects[objectIndex]);
        }
      }
    }

    let sceneCharacters=data.Characters;
    if(sceneCharacters){
      for(let i=0;i<sceneCharacters.length;i++){
        let characterIndex=game.searchCharacter(sceneCharacters[i]);
        if(characterIndex!=undefined){
          this.container.addChild(game.characters[characterIndex].sprite);
        }
      }
    }
  }

  getPath(fromX,fromY,toX,toY){
    return this.walkable.findPath(fromX, fromY, toX, toY, 0);
  }
};

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
    this.ticker.add(ShowLogo);
    this.logo.interactive=true;
    this.logo.on('pointerup', SkipLogo);
    game.app.stage.addChild(this.container);
  }
  show(){
    this.ticker.start();
    this.container.visible=true;
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

}

function movePlayer(event){
    game.player.action=null;
    game.selectedObject=null;
    game.player.move(event.data.getLocalPosition(game.app.stage));
}
//Editando aquí
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
function ShowLogo(){
  game.logoScreen.logo.alpha+=0.01;

  if(game.logoScreen.logo.alpha>1){
    game.logoScreen.ticker.stop();
    game.logoScreen.ticker.remove(ShowLogo);
    game.logoScreen.ticker.add(HideLogo);
    game.timeout = PIXI.setTimeout(3,function(){game.logoScreen.ticker.start();})
  }
}

function HideLogo(){
  game.logoScreen.logo.alpha-=0.01;

  if(game.logoScreen.logo.alpha<0){
      SkipLogo();
  }
}

function SkipLogo(){
  game.logoScreen.container.visible=false;
  if(game.logoScreen.ticker) game.logoScreen.ticker.destroy();
  if(game.timeout) game.timeout.clear();
  game.titleScreen.show();
}
