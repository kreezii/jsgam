import {game} from '../game.js';
import {TextButton} from './text.js';

export class CreditsScreen{
  constructor(data){
    this.container=new PIXI.Container();
    this.container.visible=false;
    if(data.Background!=undefined) this.background=new PIXI.Sprite(PIXI.Texture.fromFrame(data.Background));
    this.creditsText = new PIXI.Text("grgrgr",data.Style.Title);
/*
    let i;
    for (i=0; i < data.Lines.length; i++) {
    creditos += data.Lines[i].Title[game.mainLanguage];
    creditos += "\n";
    let j;
    for (j = 0; j < data.Body..Text.length; j++) {
      creditos += data.Lines[i].Text[j];
      creditos += "\n";
    }
    creditos += "\n";
}*/
  }

  show(){
    this.container.visible=true;
    PIXI.sound.play(game.settings.TitleScreen.Music,{loop:true});
  }

  hide(){
    this.container.visible=false;
  }

  update(){

  }
}
