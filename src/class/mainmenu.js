import Menu from './menu.js';

class MainMenu extends Menu{
  create(){
      let gameTexts=this.game.data.texts;
      let languages=Object.values(this.game.settings.Languages).length;
      this.addButton("New",gameTexts.NewGame);
      this.addButton("Continue",gameTexts.Continue);
      if(languages>1) this.addButton("Options",gameTexts.Options);
      if(this.game.data.help!==undefined)this.addButton("Help",gameTexts.Help);
      if(this.game.data.credits!==undefined) this.addButton("Credits",gameTexts.Credits);

      this.disable("Continue");

      this.sort();
    }

  changeLanguage(){
    let languages=Object.values(this.game.settings.Languages).length;
    this.modify("New",this.game.data.texts.NewGame);
    this.modify("Continue",this.game.data.texts.Continue);
    if(languages>1) this.modify("Options",this.game.data.texts.Options);
    if(this.game.data.help!==undefined) this.modify("Help",this.game.data.texts.Help);
    if(this.game.data.credits!==undefined) this.modify("Credits",this.game.data.texts.Credits);

    this.sort();
  }

}
export default MainMenu;
