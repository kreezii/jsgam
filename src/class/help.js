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
    let style=this.game.settings.Text.Help;
    if(!this.game.settings.Text.Help) style=this.game.settings.Text.Style;
    this.buildText();
    this.structuredText = new PIXI.BitmapText(this.text,style);
    this.structuredText.anchor.set(0.5);
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
    let helpText=this.game.data.help[this.game.activeLanguage];
    if(helpText===undefined) helpText=this.game.data.help[0];

    this.text="";

    helpText.forEach((item, i) => {
      this.text+=item;
      if(i!=helpText.length-1) this.text+="\n";
    });
  }

  changeLanguage(){
    this.buildText();
    this.structuredText.text=this.text;
    this.adjust();
  }

  adjust(){
    if(this.structuredText.width>=this.game.width || this.structuredText.height>=this.game.height){
      this.adjustText();
    }
    this.structuredText.x = this.game.width / 2;
    this.structuredText.y=this.game.height/2;
  }

adjustText(){
  let ratio = Math.min( this.game.width/this.structuredText.width,  this.game.height/this.structuredText.height);

  this.structuredText.width=this.structuredText.width*ratio*0.9;
  this.structuredText.height=this.structuredText.width*ratio*0.9;
}
  mainMenu(){
    this.game.scenes["Title"].mainMenu();
  }
}

export default Help;
