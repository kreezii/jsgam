import {game} from '../game.js';

//Branches dialogue system
export class Dialogue{
  constructor(data,index){
    this.data=data;
    this.index=index;
    this.timeout;
    this.firstTime=true;
    this.currentBranch=this.searchBranch(data.DefaultBranch);
    this.choice=null;
  }

  //Executed when we interact with a NPC
  start(){
    this.firstTime=false;
    game.player.stand();
    game.player.lock=true;
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
      if(game.timeout)  game.timeout.clear();
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
    this.timeout = PIXI.setTimeout(this.data.Speed,DialogueTimeout);
    if(choiceSelected.EndDialogue){
      if(this.timeout) this.timeout.clear();
      this.timeout = PIXI.setTimeout(this.data.Speed,EndDialogue);
    }
    if(choiceSelected.Link) this.currentBranch=this.searchBranch(choiceSelected.Link);
    else if(choiceSelected.GiveObject){
      game.objects[game.searchObject(choiceSelected.GiveObject)].take();
    }
    this.choice=null;
  }

  //Ends the conversations
  end(){
    game.textField.hideAvatar();
    game.textField.hide();
    if(this.timeout) this.timeout.clear();
    this.choice=null;
    game.currentDialogue=false;
    game.player.stand();
  }

  PlayerSay(textToSay){
    game.textField.Field.tint=0xFFFFFF;
    game.textField.Field.text=textToSay;
    game.player.animate("speak",3);
    game.textField.show();
  //  game.player.say(textToSay);
    this.timeout = PIXI.setTimeout(this.data.Speed,Answer);
  }

  NPCSay(textToSay){
    game.textField.CharacterPic.texture=PIXI.Texture.from(game.characters[game.selectedCharacter].sprite.data.Avatar);
    game.textField.showAvatar();
    game.textField.Field.tint=0xCCFFD9;
    game.textField.Field.text=textToSay;
    //game.characters[game.selectedCharacter].animate("speak",3);
    game.textField.show();

  }
}

function DialogueTimeout(){
  game.textField.hideAvatar();
  game.currentDialogue.next();
}

function EndDialogue(){
  game.currentDialogue.end();
}

function Answer(){
  game.currentDialogue.answer();
}
