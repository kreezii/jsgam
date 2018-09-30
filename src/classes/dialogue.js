import {game} from '../game.js';

export class Dialogue{
  constructor(data,index){
    this.data=data;
    this.index=index;
    this.timeout;
    this.firstTime=true;
    this.choice=null;
  }

  start(){
    game.player.lock=true;
    game.player.animate("speak",3);
    game.textField.changeText(this.data.Intro[game.mainLanguage]);
    game.textField.showText();
    game.textField.show();
    if(this.timeout) this.timeout.clear();
    this.timeout = PIXI.setTimeout(this.data.Speed,DialogueTimeout);
  }

  next(){
    if(this.firstTime){
      game.player.say(this.data.FirstTime[game.mainLanguage])
      this.firstTime=false;
      if(this.timeout) this.timeout.clear();
      this.timeout = PIXI.setTimeout(this.data.Speed,DialogueTimeout);
    }else if(this.choice!=null){
      game.player.say(this.data.Answers[this.choice][game.mainLanguage]);
      this.timeout = PIXI.setTimeout(this.data.Speed,DialogueTimeout);
      this.choice=null;
    }else this.choices();
  }

  choices(){
    if(game.timeout)  game.timeout.clear();
    if(this.timeout) this.timeout.clear();

    for(let i=0;i<this.data.Choices.length;i++){
      game.textField.Choices[i].text=this.data.Choices[i][game.mainLanguage];
    }
    game.textField.showChoices();
  }

  end(){

  }
}

function DialogueTimeout(){
  game.currentDialogue.next();
}

function NPCSay(textToSay){
  game.textField.Field.text=textToSay;
  game.textField.show();
  if(game.timeout) game.timeout.clear();
  game.timeout = PIXI.setTimeout(game.currentDialogue.data.Speed,function(){game.textField.hide();})
}
