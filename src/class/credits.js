
import tweenManager from 'k8w-pixi-tween';

class Credits{
  constructor(){
    this.container=new PIXI.Container();
    this.container.visible=false;
    this.container.interactive=true;
    this.container.buttonMode=true;
    }

  create(){
    let config=this.game.data.credits;

    if(config.Background!==undefined) this.background=new PIXI.Sprite(PIXI.Texture.from(config.Background));

    this.buildText();

    this.structuredText = new PIXI.extras.BitmapText(this.text,config.Style);

    this.container.addChild(this.structuredText);

    this.container.x = this.game.width / 2;
    this.container.pivot.x = this.container.width / 2;
    this.container.y=this.game.height;
    this.tween = PIXI.tweenManager.createTween(this.container);
    this.tween
      .from({ y: this.game.height})
      .to({ y: 0 - this.container.height});
    this.tween.time = 20000;
    this.tween.expire=true;
    this.tween.delay=500;
    this.tween.on("end", this.mainMenu.bind(this));

    this.container.on('pointerup', this.mainMenu.bind(this));
  }

  show(){
    this.container.visible=true;
    this.tween.start();
  }

  hide(){
    this.tween.stop().reset();
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

  update(){
    PIXI.tweenManager.update();
  }

  changeLanguage(){
    this.buildText();
    this.structuredText.text=this.text;
  }

  mainMenu(){
    this.game.scenes["Title"].mainMenu();
  }
}

export default Credits;
