import {Infotxt} from './text.js'

class Help{
  constructor(){
    this.container=new PIXI.Container();
    this.container.visible=false;
    this.container.interactive=true;
    this.container.buttonMode=true;
    this.text="";
  }

  create(){
    let config=this.game.data.help;
    this.buildText();
    this.structuredText = new PIXI.BitmapText(this.text,this.game.settings.Text.Help);
    this.container.addChild(this.structuredText);
    this.adjust();
    this.container.on('pointerup', this.mainMenu.bind(this));
  }

  show(){
    this.container.visible=true;
  }

  hide(){
    this.container.visible=false;
  }

  buildText(){
    let helpText=this.game.data.help;
    this.text="";

    helpText.forEach((item, i) => {
      this.text+=item[this.game.activeLanguage];
      if(i!=helpText.length-1) this.text+="\n";
    });
  }

  changeLanguage(){
    this.buildText();
    this.adjust();
  }

  adjust(){
    this.structuredText.x = this.game.width / 2;
    this.structuredText.y=this.game.height;
  }

  mainMenu(){
    this.game.scenes["Title"].mainMenu();
  }
}

export default Help;
