import {Button} from './text.js'

//Branches dialogue system
class Dialogue{
  constructor(){
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
      this.game.player.say(choiceSelected.Text[this.game.activeLanguage]);
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
    this.game.activeNPC.say(choiceSelected.Answer[this.game.activeLanguage]);

    if(choiceSelected.Link){
      this.currentBranch=this.branches[choiceSelected.Link];
    }else if(choiceSelected.Puzzle){
      choiceSelected.Repeat=false;
      this.end();
      this.game.puzzles[choiceSelected.Puzzle].resolve();
    }else if(choiceSelected.EndDialogue){
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
