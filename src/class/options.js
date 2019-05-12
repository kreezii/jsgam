import Menu from './menu.js';
import {Button} from './text.js';

class Options extends Menu{
  create(){
    this.container.visible=false;
    let languages=this.game.settings.Languages
    for(let i=0;i<languages.length;i++){
      this.addLanguage(languages[i],);
      this.buttons[languages[i]].on('pointerup', this.setLanguage);
    }

    let langArray=Object.values(this.buttons);
    langArray[this.game.activeLanguage].tint=0xFF0000;

    this.addButton("Back",this.game.data.texts.Back);
    this.sort();
  }

  addLanguage(name){
    this.buttons[name]=new Button(name,this.game.settings.Text.ButtonStyle);
    this.buttons[name].father=this;
    this.container.addChild(this.buttons[name]);
  }

  setLanguage(){
    this.father.change(this.text);
  }

  change(text){
    let languages=this.game.settings.Languages
    this.buttons[languages[this.game.activeLanguage]].tint=0xFFFFFF;
    this.game.activeLanguage=this.game.settings.Languages.indexOf(text);
    this.buttons[languages[this.game.activeLanguage]].tint=0xFF0000;
    this.modify("Back",this.game.data.texts.Back);
    this.sort();
  }

}
export default Options;
