import Scene from './scene.js';
import MainMenu from './mainmenu.js'
import Options from './options.js'
import Help from './help.js'
import Credits from './credits.js'
import Confirmation from './confirmation.js'

class Title extends Scene{
  build(){
    this.states={};
    let languages=Object.values(this.game.settings.Languages).length;
    //Add Menus
    this.addState("MainMenu", new MainMenu());
    this.addState("Warning", new Confirmation());
    //Add actions to the menu buttons
    this.addAction("MainMenu","New",this.checkAdventure.bind(this));
    this.addAction("MainMenu","Continue",this.loadAdventure.bind(this));

    this.addAction("Warning","Yes",this.newAdventure.bind(this));
    this.addAction("Warning","No",this.mainMenu.bind(this));

    if(languages>1){
        this.addState("Options", new Options());
        this.addAction("MainMenu","Options",this.showOptions.bind(this));
        this.addAction("Options", "Back",this.mainMenu.bind(this));
    }
    if(this.game.data.help!==undefined){
      this.addState("Help", new Help());
      this.addAction("MainMenu","Help",this.showHelp.bind(this));
    }

    if(this.game.data.credits!==undefined){
      this.addState("Credits", new Credits());
      this.addAction("MainMenu","Credits",this.showCredits.bind(this));
    }

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
  }

  mainMenu(){
    let menuOptions=Object.getOwnPropertyNames(this.states);

    menuOptions.forEach(function(val, idx, array) {
      if(this.states[val]!==undefined && val!=="MainMenu") this.states[val].hide();
    },this);

    this.changeLanguage();
    this.states["MainMenu"].show();
  }

  changeLanguage(){
    this.states["MainMenu"].changeLanguage();
    this.states["Warning"].changeLanguage();
  }

  warning(){
    this.states["MainMenu"].hide();
    this.states["Warning"].show();
  }

  checkAdventure(){
    if(this.game.storage.progress!==undefined){
      this.warning();
    }else{
      this.newAdventure();
    }
  }

  newAdventure(){
    //Delete any game progress
    this.game.storage.delete();

    //Set the first scene
    this.game.changeScene(this.game.settings.FirstScene);

    //Here we go
    this.game.start();

  }

  loadAdventure(){
    this.game.storage.load();
    this.game.changeScene(this.game.storage.progress.latestScene);
    this.game.start();
  }
}

export default Title;
