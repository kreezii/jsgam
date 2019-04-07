import {game} from '../game.js';

//Branches dialogue system
export class Dialogue{
  constructor(data){
    this.data=data;
    this.timeout=null;
    this.firstTime=true;
    this.currentBranch=this.searchBranch(data.DefaultBranch);
    this.choice=null;
  }

  //Executed when we interact with a NPC
  start(){
    this.firstTime=false;
    game.player.stand();
    game.player.lock=true;
    if(game.timeout){
      game.timeout.clear();
      game.timeout=null;
    }
    if(this.timeout) this.timeout.clear();
    this.timeout = PIXI.setTimeout(this.data.Speed,DialogueTimeout);
    game.textField.show();
    this.next();
  }

  //Executed everytime we choose an option
  next(){
    if(this.choice!=null){
      let choiceSelected=this.data.Branches[this.currentBranch].Choices[this.choice];
      this.PlayerSay(choiceSelected.Text[game.mainLanguage]);
    }else{
      if(game.timeout){
        game.timeout.clear();
        game.timeout=null;
      }
      if(this.timeout) this.timeout.clear();
      this.checkChoices();
      game.textField.showChoices();
    }
  }

  //Check the choices to show
  checkChoices(){
    game.textField.clearChoices();
    let branchChoices=this.data.Branches[this.currentBranch].Choices;
    for(let i=0;i<branchChoices.length;i++){
      if(branchChoices[i].clicked && branchChoices[i].Repeat==false){
        game.textField.Choices[i].alpha=0.5;
      }else game.textField.Choices[i].alpha=1;
      game.textField.Choices[i].visible=true;
      game.textField.Choices[i].text=branchChoices[i].Text[game.mainLanguage];
    }
  }

  //Search for a branch with a given name
  searchBranch(name){
    let branchFound=-1;
    for(let i=0;i<this.data.Branches.length;i++)
         if(this.data.Branches[i].Name==name)
         {
             branchFound=i;
             break;
         }
    return branchFound;
  }

  answer(){
    let choiceSelected=this.data.Branches[this.currentBranch].Choices[this.choice];
    this.NPCSay(choiceSelected.Answer[game.mainLanguage]);
    if(choiceSelected.EndDialogue){
      if(this.timeout) this.timeout.clear();
      this.timeout = PIXI.setTimeout(this.data.Speed,EndDialogue);
    }
    if(choiceSelected.Link) this.currentBranch=this.searchBranch(choiceSelected.Link);
    else if(choiceSelected.GiveObject){
      choiceSelected.Repeat=false;
      game.objects[game.searchObject(choiceSelected.GiveObject)].take();
    }
    this.choice=null;
  }

  //Ends the conversations
  end(){
    game.textField.hideAvatar();
    game.textField.hide();
    if(this.timeout){
      this.timeout.clear();
      this.timeout=null;
    }
    this.choice=null;
    game.currentDialogue=null;
    game.player.stand();
    game.characters[game.selectedCharacter].stand();
    game.selectedCharacter=null;
  }

  PlayerSay(textToSay){
    game.player.say(textToSay);
    this.timeout = PIXI.setTimeout(this.data.Speed,Answer);
  }

  NPCSay(textToSay){
    game.characters[game.selectedCharacter].say(textToSay);
    this.timeout = PIXI.setTimeout(this.data.Speed,DialogueTimeout);
  }
}

function DialogueTimeout(){
  game.textField.hideAvatar();
  game.characters[game.selectedCharacter].stand();
  game.currentDialogue.next();
}

function EndDialogue(){
  game.currentDialogue.end();
}

function Answer(){
  game.player.stand();
  game.currentDialogue.answer();
}
