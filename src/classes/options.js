import {game} from '../game.js';
import {TextButton} from './text.js';

export class Options{
  constructor(){
    this.container=new PIXI.Container();
    this.container.visible=false;

    this.languages=[];
    for(let i=0;i<game.settings.Languages.length;i++){
      this.languages[i]=new TextButton(game.settings.Languages[i],i);
      this.languages[i].on('pointerup', SelectLanguage);
      this.container.addChild(this.languages[i]);
      if(i>0)this.languages[i].y=this.languages[i-1].y+this.languages[i-1].height;
    }
    this.languages[game.mainLanguage].tint="0xFF0000";
    this.backButton=new TextButton(game.settings.Text.Back[game.mainLanguage],this.languages.length);
    this.backButton.on('pointerup', Back);
    this.container.addChild(this.backButton);
    let latestOption=game.settings.Languages.length-1;
    this.backButton.y=this.languages[latestOption].y+this.languages[latestOption].height;

    this.container.x = game.width / 2;
    this.container.y = game.height / 2;
    this.container.pivot.x = this.container.width / 2;
    this.container.pivot.y = this.container.height / 2;
  }
}

function SelectLanguage(){
  let selected=game.settings.Languages.indexOf(this.text);
  if(selected!=-1){
    game.titleScreen.options.languages[game.mainLanguage].tint="0xFFFFFF";
    this.tint="0xFF0000";
    game.mainLanguage=game.settings.Languages.indexOf(this.text);
    game.titleScreen.menu.update();
  }

}

function Back(){
  game.titleScreen.menu.container.visible=true;
  game.titleScreen.options.container.visible=false;
}
