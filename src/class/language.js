import Menu from './menu.js';
import {Button} from './text.js';

class Language extends Menu{
  create(){
    this.container.visible=false;
    let languages=this.game.settings.Languages;
    for(let i=0;i<languages.length;i++){
      this.addLanguage(languages[i]);
      this.buttons[languages[i]].on('pointerup', this.setLanguage);
    }

    let langArray=Object.values(this.buttons);
    langArray[this.game.activeLanguage].tint=0xFF0000;

    this.addButton("Back",this.game.data.texts.Back);
    this.sort();
  }

  addLanguage(name){
    this.buttons[name]=new Button(name,this.game.settings.Text.Button);
    this.buttons[name].anchor.set(0.5,0);
    this.buttons[name].father=this;
    this.container.addChild(this.buttons[name]);
  }

  setLanguage(){
    this.father.change(this.text);
  }

  change(text){
    let languages=this.game.settings.Languages;
    this.buttons[languages[this.game.activeLanguage]].tint=0xFFFFFF;

    this.game.activeLanguage=this.game.settings.Languages.indexOf(text);
    this.buttons[languages[this.game.activeLanguage]].tint=0xFF0000;
    this.modify("Back",this.game.data.texts.Back);

    this.sort();
  }

  sort(){
    let i;
    let arrayButtons=Object.values(this.buttons);
    let length=arrayButtons.length;

    arrayButtons[0].x=this.game.width/2;
    arrayButtons[0].y=0;

    for(i=1;i<length;i++)
    {
      arrayButtons[i].x=this.game.width/2;
      arrayButtons[i].y=arrayButtons[i-1].y+arrayButtons[i-1].height*1.5;
    }

    //Center Vertically
    this.container.y=this.game.height/2;
    this.container.pivot.y = this.container.height / 2;
  }
}
export default Language;
