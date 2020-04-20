import Menu from './menu.js';
import {Infotxt} from './text.js'

class Confirmation extends Menu{
  create(){
    this.hide();
    let gameTexts=this.game.data.texts;
    this.addText("Warning",gameTexts.Warning);
    this.addButton("Yes",gameTexts.Yes);
    this.addButton("No",gameTexts.No);
    this.adjust();
  }

  changeLanguage(){
    this.modify("Warning",this.game.data.texts.Warning);
    this.modify("Yes",this.game.data.texts.Yes);
    this.modify("No",this.game.data.texts.No);
    this.adjust();
  }

  adjust(){
    this.buttons["Warning"].x=this.game.width/2;
    this.buttons["Warning"].y=this.game.height/4;

    this.buttons["Yes"].x=this.game.width/2-this.buttons["Yes"].width;
    this.buttons["Yes"].y=this.buttons["Warning"].y+this.buttons["Warning"].height*1.5;

    this.buttons["No"].x=this.game.width/2+this.buttons["No"].width;
    this.buttons["No"].y=this.buttons["Warning"].y+this.buttons["Warning"].height*1.5;
  }

  mainMenu(){
    this.game.scenes["Title"].mainMenu();
  }
}

export default Confirmation;
