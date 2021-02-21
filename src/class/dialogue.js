import {Button} from './text.js'

//Branches dialogue system
class Dialogue{
  constructor(game){
    this.game=game;
    this.timeoutID=null;
    this.firstTime=true;
    this.choice=null;
    this.branches={};
  }

  setup(config){
    this.config=config;

    //Get dialogue branches
    let i;
    length=this.config.Branches.length;
    for(i=0;i<length;i++)
    {
      this.branches[this.config.Branches[i].Name]=this.config.Branches[i];
    }

    this.currentBranch=this.branches[this.config.DefaultBranch];
  }

  //Executed when we interact with a NPC
  start(){
    this.firstTime=false;
    this.game.player.lock=true;
    this.game.textField.show();
    this.game.textField.hideAvatar();
    this.game.textField.Choices.get();
  }

  //Executed everytime we choose an option
  next(){
    if(this.choice!==null){
      let choiceSelected=this.currentBranch.Choices[this.choice];
      this.game.textField.Choices.hide();
      let voice=undefined;
      if(choiceSelected.Voice!==undefined){
        voice=choiceSelected.Voice[this.game.activeLanguage];
      }
      let text=choiceSelected.Text[this.game.activeLanguage];
      if(text===undefined) text=choiceSelected.Text[0];
      this.game.player.say(text,voice);
    }else{
      this.game.textField.hideAvatar();
      this.game.textField.Choices.get();
    }
  }

  //Search for a branch with a given name
  searchBranch(name){
    let branchFound=-1;
    let i;
    let length=this.config.Branches.length
    for(i=0;i<length;i++)
         if(this.config.Branches[i].Name===name)
         {
             branchFound=i;
             break;
         }
    return branchFound;
  }

  answer(){
    let choiceSelected=this.currentBranch.Choices[this.choice];
    let voice=undefined;
    if(choiceSelected.AnswerVoice!==undefined){
      voice=choiceSelected.AnswerVoice[this.game.activeLanguage];
    }
    let text=choiceSelected.Answer[this.game.activeLanguage];
    if(text===undefined) text=choiceSelected.Answer[0];
    this.game.activeNPC.say(text,voice);

    if(choiceSelected.Link){
      this.currentBranch=this.branches[choiceSelected.Link];
    }

    if(choiceSelected.Puzzle){
      if(this.game.puzzles[choiceSelected.Puzzle]!==undefined) this.game.puzzles[choiceSelected.Puzzle].resolve();
    }

    if(choiceSelected.EndDialogue){
      this.end();
    }


    this.choice=null;
  }

  //Ends the conversations
  end(){
    this.game.activeNPC=null;
    this.game.activeDialogue=null;
  }

  timeOut(){
    this.next();
  }
}

export default Dialogue;
