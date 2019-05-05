class CutScene{
  constructor(){
    this.container=new PIXI.Container();
    this.sequenceIndex=0;
    this.played=false;
  }

  build(){
    if(this.config.Video){
      this.videoData = this.game.files.resources[this.config.Video].data;
      this.videoEnds=this.end.bind(this);
      this.videoData.addEventListener('ended',this.videoEnds);
    }else if(this.config.Sequence){
      this.image=new PIXI.Sprite(PIXI.Texture.from(this.config.Sequence[this.sequenceIndex].Image));
      var ratio = Math.min(this.game.width/this.image.width, this.game.height/this.image.height);
      this.image.scale.set(ratio/2);

      this.container.interactive=true;
      this.container.buttonMode=true;
      this.container.on('pointertap',this.next.bind(this));

      this.container.addChild(this.image);

      this.field=new PIXI.Text(this.config.Sequence[this.sequenceIndex].Text[this.game.activeLanguage],this.game.settings.Text.Style);
      this.field.anchor.set(0.5,0);
      this.field.x=this.image.width/2;
      this.field.y=this.image.height+this.field.height/2;

      this.container.addChild(this.field);

      this.container.x = (this.game.width - this.image.width) / 2;
      this.container.y = (this.game.height - this.image.height) / 2;
    }
  }

  show(){
      if(this.config.Video) {
        let videoTexture = PIXI.Texture.from(this.videoData);
      	this.videoSprite = new PIXI.Sprite(videoTexture);
        this.videoSprite.width = this.game.width;
        this.videoSprite.height = this.game.height;
        this.videoSprite.interactive=true;
        this.videoSprite.buttonMode=true;
        this.videoSprite.on('pointertap',this.end.bind(this));
        this.container.addChild(this.videoSprite);
      }else if(this.config.Sequence) {
        this.timeoutID = setTimeout(this.next.bind(this),
                         this.config.Sequence[this.sequenceIndex].Time*1000);
      }
      this.game.app.stage.addChild(this.container);
      this.game.activeScene.hide();
      this.game.inventory.hideIcon();
      this.game.player.hide();
  }

  hide(){
      this.container.parent.removeChild(this.container);
  }

  next(){
    if(this.timeoutID) clearTimeout(this.timeoutID);
    if(this.sequenceIndex<this.config.Sequence.length-1){
      this.sequenceIndex+=1;
      this.field.text=this.config.Sequence[this.sequenceIndex].Text[this.game.activeLanguage];
      this.image.texture=(PIXI.Texture.from(this.config.Sequence[this.sequenceIndex].Image));
      this.timeoutID = setTimeout(this.next.bind(this), this.config.Sequence[this.sequenceIndex].Time*1000);
    }else{
      this.end();
    }
  }

  end(){
    if(this.timeoutID) clearTimeout(this.timeoutID);
    if(this.videoData){
      this.videoData.pause();
      this.videoData.removeEventListener('ended',this.videoEnds);
    }

    this.hide();
    this.played=true;
    this.game.activeScene.show();
    this.game.inventory.showIcon();
    this.game.player.show();
  }
}

export default CutScene;
