import Menu from './menu.js';

class MainMenu extends Menu{
  create(){
      let gameTexts=this.game.data.texts;
      let languages=Object.values(this.game.settings.Languages).length;
      if(gameTexts.Title!==undefined) this.addText("Title",gameTexts.Title,this.game.settings.Text.Title);
      this.addButton("New",gameTexts.NewGame);
      this.addButton("Continue",gameTexts.Continue);
      if(languages>1) this.addButton("Language",gameTexts.Language);
      if(this.game.data.help!==undefined)this.addButton("Help",gameTexts.Help);
      if(this.game.data.credits!==undefined) this.addButton("Credits",gameTexts.Credits);
      this.container.parentLayer = this.game.layerUI;
      this.sort();

      this.disable("Continue");
    }

  changeLanguage(){
    let gameTexts=this.game.data.texts;
    let languages=Object.values(this.game.settings.Languages).length;
    this.modify("New",this.game.data.texts.NewGame);
    this.modify("Continue",this.game.data.texts.Continue);
    if(gameTexts.Title!==undefined) this.modify("Title",gameTexts.Title);
    if(languages>1) this.modify("Language",gameTexts.Language);
    if(this.game.data.help!==undefined) this.modify("Help",gameTexts.Help);
    if(this.game.data.credits!==undefined) this.modify("Credits",gameTexts.Credits);

    this.sort();
  }

  sort(){
    this.buttons["Title"].x=this.game.width/2;
    this.buttons["Title"].y=this.game.height*0.05;

    let moveHeight=0;

    if(this.buttons["Help"] || this.buttons["Language"]) moveHeight=this.buttons["New"].height;;

    this.buttons["New"].x=this.game.width/4;
    this.buttons["New"].y=this.game.height/2-moveHeight;

    this.buttons["Continue"].x=this.game.width-this.game.width/4;
    this.buttons["Continue"].y=this.buttons["New"].y;

    if(this.buttons["Language"]){
      let moveWidth=2;
      if(this.buttons["Help"]) moveWidth=4;
      this.buttons["Language"].x=this.game.width/moveWidth;
      this.buttons["Language"].y=this.game.height-this.game.height/4*1.5;
    }

    if(this.buttons["Help"]){
      let moveWidth=this.game.width/2;
      if(this.buttons["Language"]) moveWidth=this.game.width-this.game.width/4;
      this.buttons["Help"].x=moveWidth;
      this.buttons["Help"].y=this.game.height-this.game.height/4*1.5;
    }

    if(this.buttons["Credits"]){
      this.buttons["Credits"].x=this.game.width/2;
      this.buttons["Credits"].anchor.set(0.5,1);
      this.buttons["Credits"].y=this.game.height*0.95;
      //this.buttons["Credits"].y=this.game.height-(this.buttons["Credits"].height*1.5);
    }
  }

}
export default MainMenu;
