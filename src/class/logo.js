class Logo{
  constructor(game){
    this.game=game;
    this.index=0;
    this.timeoutID=null;
    this.tween=null;
    this.image=new PIXI.Sprite(
      PIXI.Texture.from(this.game.settings.Logos[this.index]));
    this.image.anchor.set(0.5,0.5)
    this.image.position.set(this.game.width/2,this.game.height/2)
    this.image.interactive=true;
    this.image.buttonMode=true;
    this.image.on('pointertap',this.fadeOut.bind(this));
    this.image.alpha=0;
  }

  show(){
    this.game.app.stage.addChild(this.image);
    this.fadeIn();
  }

  fadeIn(){
    if(this.tween) this.tween.kill();
    this.tween=TweenMax.set(this.image,{alpha:0});
    this.tween=TweenMax.fromTo(this.image, 1, {alpha:0}, {alpha:1, onComplete:this.timer.bind(this)});
  }

  timer(){
    this.timeoutID = setTimeout(this.fadeOut.bind(this), 3*1000);
  }

  fadeOut(){
    this.image.interactive=false;
    if(this.tween) this.tween.kill();
    this.tween=TweenMax.fromTo(this.image, 1, {alpha:1}, {alpha:0, onComplete:this.next.bind(this)});
  }

  next(){
    this.image.interactive=true;
    if(this.timeoutID) clearTimeout(this.timeoutID);
    this.index++;
    if(this.game.settings.Logos[this.index]!==undefined)
    {
      this.image.texture=(PIXI.Texture.from
        (this.game.settings.Logos[this.index]));
      this.fadeIn();
    }
    else this.end();
  }

  end(){

    if(this.timeoutID) clearTimeout(this.timeoutID);
    if(this.tween) this.tween.kill();
    this.game.app.stage.removeChild(this.image);

    //Set Title as the first scene to show
    this.game.setScene(this.game.titleLabel);
    this.game.fadeIn();
    if(this.game.options!==null) this.game.options.show();
  }
}

export default Logo;
