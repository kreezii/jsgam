import {game} from '../game.js';

export class Dialogue{
  constructor(data,index){
    this.data=data;
    this.index=index;
  }

  start(){
    game.player.animate("speak",3);
    game.player.say(game.currentDialogue.data.Intro[game.mainLanguage]);
  }
}
