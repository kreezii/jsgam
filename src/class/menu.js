import {Button,Infotxt} from './text.js'

class Menu{
  constructor(){
    this.container=new PIXI.Container();
    this.game=null;
    this.buttons={};
    }

  addButton(name,text){
    this.buttons[name]=new Button(text[this.game.activeLanguage],this.game.settings.Text.Button);
    this.buttons[name].anchor.set(0.5,0);
    this.container.addChild(this.buttons[name]);
  }

  addText(name,text,style){
    let textStyle=this.game.settings.Text.Button;
    if(style!==undefined) textStyle=style;
    this.buttons[name]=new Infotxt(text[this.game.activeLanguage],textStyle);
    this.buttons[name].anchor.set(0.5,0);
    this.container.addChild(this.buttons[name]);
  }

  modify(name,text){
    this.buttons[name].text=text[this.game.activeLanguage];
  }

  disable(name){
    this.buttons[name].alpha=0.5;
    this.buttons[name].interactive=false;
  }

  enable(name){
    this.buttons[name].alpha=1.0;
    this.buttons[name].interactive=true;
  }

  sort(){
    let i;
    let arrayButtons=Object.values(this.buttons);
    let length=arrayButtons.length;
    arrayButtons[0].x=this.game.width/2;
    arrayButtons[0].y=0;

    for(i=1;i<length;i++)
    {
      arrayButtons[i].x=this.game.width/2;
      arrayButtons[i].y=arrayButtons[i-1].y+arrayButtons[i-1].height*1.5;
    }

    //Center Vertically
    this.container.y=this.game.height/2;
    this.container.pivot.y = this.container.height / 2;
  }

  hide(){
    this.container.visible=false;
  }

  show(){
    this.container.visible=true;
  }

}
export default Menu;
