class Credits{
  constructor(){
    this.container=new PIXI.Container();
    this.container.visible=false;
    this.container.interactive=true;
    this.container.buttonMode=true;
    }

  create(){
    let config=this.game.data.credits;

    if(config.Background!==undefined){
      this.background=new PIXI.Sprite(PIXI.Texture.from(config.Background));
      this.container.addChild(this.background);
    }

    this.buildText();
    this.speed=null;

    if(this.game.data.credits.Time!==undefined){
      this.speed=this.game.data.credits.Time;
    }else{
      this.speed=20;
    }

    this.structuredText = new PIXI.BitmapText(this.text,this.game.settings.Text.Credits);
    this.structuredText.anchor.set(0.5,0);
    this.tween=null;
    this.container.addChild(this.structuredText);
    this.adjust();

    this.container.on('pointerup', this.mainMenu.bind(this));
  }

  show(){
    this.container.visible=true;
    this.animate();
  }

  animate(){
    TweenMax.set(this.structuredText,{y: this.game.height});
    this.tween=TweenMax.to(this.structuredText, 20, {y: 0 - this.structuredText.height,onComplete:this.mainMenu.bind(this)});
  }

  hide(){
    this.container.visible=false;
  }


  buildText(){
    let credits=this.game.data.credits;

    this.text="";
    let i;
    for (i=0; i < credits.Lines.length; i++) {
    this.text += credits.Lines[i].Title[this.game.activeLanguage];
    this.text += "\n";
    let j;

    for (j = 0; j < credits.Lines[i].Text.length; j++) {
      this.text += credits.Lines[i].Text[j];
      this.text += "\n";
    }
    this.text += "\n";
    }
  }

  adjust(){
    this.structuredText.x = this.game.width / 2;
    this.structuredText.y=this.game.height;
  }

  changeLanguage(){
    this.buildText();
    this.structuredText.text=this.text;
    this.adjust();
  }

  mainMenu(){
    this.tween.kill();
    this.game.scenes["Title"].mainMenu();
  }
}

export default Credits;
