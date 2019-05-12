import {Button} from './text.js'

class Menu{
  constructor(){
    this.container=new PIXI.Container();
    this.game=null;
    this.buttons={};
    }

  addButton(name,text){
    this.buttons[name]=new Button(text[this.game.activeLanguage],this.game.settings.Text.ButtonStyle);
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
    arrayButtons[0].y=0;
    for(i=1;i<length;i++)
    {
      arrayButtons[i].y=arrayButtons[i-1].y+arrayButtons[i-1].height*1.5;
      arrayButtons[i].x=this.container.width/2-arrayButtons[i].width/2;
    }

    this.center();
  //  this.resize();
  }

  resize(){
    let ratio = Math.min( this.game.width/this.container.width,  this.game.height/this.container.height);
    //console.log(ratio)
    this.container.scale.set(ratio*0.95);
  }

  hide(){
    this.container.visible=false;
  }

  show(){
    this.container.visible=true;
  }

  center(){
    this.container.x = this.game.width / 2;
    this.container.y = this.game.height / 2;
    this.container.pivot.x = this.container.width / 2;
    this.container.pivot.y = this.container.height / 2;
  }

}
export default Menu;
