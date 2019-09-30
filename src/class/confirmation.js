import Menu from './menu.js';
import {Infotxt} from './text.js'

class Confirmation extends Menu{
  create(){
    this.hide();
    let gameTexts=this.game.data.texts;
    this.addText("Warning",gameTexts.Warning);
    this.addButton("Yes",gameTexts.Yes);
    this.addButton("No",gameTexts.No);
    this.sort();
  }

  changeLanguage(){
    //this.modify("Warning",this.game.data.texts.Warning);
    this.text.text=this.game.data.texts.Warning[this.game.activeLanguage];
    this.modify("Yes",this.game.data.texts.Yes);
    this.modify("No",this.game.data.texts.No);
    this.sort();
  }

  sort(){
    this.text.y=0
    this.text.x=this.game.width/2-this.text.width/2;
    this.buttons["Yes"].y=this.text.height*1.5;
    this.buttons["Yes"].x=this.buttons["Yes"].width;
    this.buttons["No"].y=this.text.height*1.5;
    this.buttons["No"].x=this.game.width-this.buttons["No"].width*2;
    this.container.y=this.game.height/2-this.container.height/2;
  }

  mainMenu(){
    this.game.scenes["Title"].mainMenu();
  }

  addText(name,text){
    this.text=new Infotxt(text[this.game.activeLanguage],this.game.settings.Text.Button);
    this.container.addChild(this.text);
  }
}

export default Confirmation;
