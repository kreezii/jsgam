import {game} from '../game.js';

export class Dialogue{
  constructor(data,index){
    this.data=data;
    this.index=index;
    this.timeout;
    this.firstTime=true;
    this.choiceList=0;
    this.currentList;
    this.choice=null;
  }

  start(){
    this.firstTime=false;
    game.player.stand();
    game.player.lock=true;
    if(this.timeout) this.timeout.clear();
    this.timeout = PIXI.setTimeout(this.data.Speed,DialogueTimeout);
    game.textField.show();
    this.next();
  }

  next(){
    if(this.choice!=null){
      let choiceSelected=this.data.Choices[this.choiceList][this.choice];
      game.player.say(choiceSelected.Answer[game.mainLanguage]);
      this.timeout = PIXI.setTimeout(this.data.Speed,DialogueTimeout);
      if(choiceSelected.EndDialogue) this.end();
      if(choiceSelected.Link>=0) this.choiceList=choiceSelected.Link;
      this.choice=null;
    }else{
      if(game.timeout)  game.timeout.clear();
      if(this.timeout) this.timeout.clear();
      this.checkChoices();
      game.textField.showChoices();
    }
  }

  checkChoices(){
    game.textField.clearChoices();
    for(let i=0;i<this.data.Choices[this.choiceList].length;i++){
      if(this.data.Choices[this.choiceList][i].clicked && this.data.Choices[this.choiceList][i].Repeat==false){
        game.textField.Choices[i].alpha=0.5;
      }else game.textField.Choices[i].alpha=1;
      game.textField.Choices[i].visible=true;
      game.textField.Choices[i].text=this.data.Choices[this.choiceList][i].Text[game.mainLanguage];
    }
  }

  end(){
    game.textField.hide();
    if(this.timeout) this.timeout.clear();
    this.choice=null;
    game.currentDialogue=false;
    game.player.stand();
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
