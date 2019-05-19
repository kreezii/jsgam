class Help{
  constructor(){
    this.container=new PIXI.Container();
    this.container.visible=false;
    this.container.interactive=true;
    this.container.buttonMode=true;
    }

  create(){
    let config=this.game.settings;

    this.background=new PIXI.Sprite(PIXI.Texture.from(config.Help[this.game.activeLanguage]));
    this.container.addChild(this.background);
    this.center();
    this.container.on('pointerup', this.mainMenu.bind(this));
  }

  show(){
    this.container.visible=true;
  }

  hide(){
    this.container.visible=false;
  }

  changeLanguage(){
    this.background.texture=PIXI.Texture.from(this.game.settings.Help[this.game.activeLanguage]);
    this.center();
  }

  center(){
    this.container.x = this.game.width / 2;
    this.container.y = this.game.height / 2;
    this.container.pivot.x = this.container.width / 2;
    this.container.pivot.y = this.container.height / 2;
  }
  mainMenu(){
    this.game.scenes["Title"].mainMenu();
  }
}

export default Help;
