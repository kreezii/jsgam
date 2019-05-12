import Scene from './scene.js';
import MainMenu from './mainmenu.js'
import Options from './options.js'
import Help from './help.js'
import Credits from './credits.js'

import 'pixi-sound';

class Title extends Scene{
  build(){
    this.states={};

    //Add Menus
    this.addState("MainMenu", new MainMenu());
    this.addState("Options", new Options());
    this.addState("Credits", new Credits());
    this.addState("Help", new Help());

    //Add actions to the menu buttons
    this.addAction("MainMenu","Options",this.showOptions.bind(this));
    this.addAction("MainMenu","Help",this.showHelp.bind(this));
    this.addAction("MainMenu","Credits",this.showCredits.bind(this));
    this.addAction("MainMenu","New",this.newAdventure.bind(this));

    this.addAction("Options", "Back",this.mainMenu.bind(this));

  }

  addAction(name,button,action){
    this.states[name].buttons[button].on('pointerup',action)
  }

  addState(name, state, config) {
      this.states[name] = state;

      //Set game so state can access it
      state.game = this.game;

      //Create state
      state.create();

      this.container.addChild(this.states[name].container);
  }

  showOptions(){
    this.states["MainMenu"].hide();
    this.states["Options"].show();
  }

  showHelp(){
    this.states["MainMenu"].hide();
    this.states["Help"].show();
  }

  showCredits(){
    this.states["MainMenu"].hide();
    this.states["Credits"].show();
    this.game.activeState=this.states["Credits"];
  }

  mainMenu(){
    this.game.activeState=null;
    this.states["Credits"].hide();
    this.states["Options"].hide();
    this.states["Help"].hide();
    this.changeLanguage();
    this.states["MainMenu"].show();

  }

  changeLanguage(){
    this.states["MainMenu"].changeLanguage();
    this.states["Credits"].changeLanguage();
    this.states["Help"].changeLanguage();
    //game.titleScreen.warning.update();
  }

  newAdventure(){
    this.game.start();
  }

}

export default Title;
