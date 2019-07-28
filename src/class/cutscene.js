import { TweenMax } from "gsap";
import PixiPlugin from "gsap/PixiPlugin";

class CutScene{
  constructor(){
    this.container=new PIXI.Container();
    this.music=null;
    this.sequenceIndex=0;
    this.played=false;
  }

  build(){
    if(this.config.Video){
      this.videoData = this.game.files.resources[this.config.Video].data;
      this.videoEnds=this.end.bind(this);
      this.videoData.addEventListener('ended',this.videoEnds);
    }else if(this.config.Sequence){
      this.tween=null;
      this.image=new PIXI.Sprite(PIXI.Texture.from(this.config.Sequence[this.sequenceIndex].Image));
      this.image.anchor.set(0.5,0);
      this.container.interactive=true;
      this.container.buttonMode=true;
      this.container.on('pointertap',this.next.bind(this));
      this.container.addChild(this.image);
      this.field=new PIXI.extras.BitmapText(this.config.Sequence[this.sequenceIndex].Text[this.game.activeLanguage],this.game.settings.Text.Style);
      this.field.anchor.set(0.5,1);
      this.field.maxWidth=this.game.width;
      this.container.addChild(this.field);
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
      this.adjust();z
      this.setMusic();
    }
    this.game.app.stage.addChild(this.container);
    this.fadeIn();

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
      this.adjust();
      this.fadeIn();
      this.setMusic();
    }else{
      this.end();
    }
  }

  fadeIn(){
    if(this.tween) this.tween.kill();
    this.tween=TweenMax.fromTo(this.container, 1, {alpha:0}, {alpha:1, onComplete:this.timer.bind(this)});
  }

  timer(){
    this.timeoutID = setTimeout(this.fadeOut.bind(this), this.config.Sequence[this.sequenceIndex].Time*1000);
  }

  fadeOut(){
    if(this.tween) this.tween.kill();
    this.tween=TweenMax.fromTo(this.container, 1, {alpha:1}, {alpha:0, onComplete:this.next.bind(this)});
  }

  end(){
    this.game.activeCutscene=null;
    if(this.videoData){
      this.videoData.pause();
      this.videoData.removeEventListener('ended',this.videoEnds);
    }

    if(this.tween) this.tween.kill();
    if(this.timeoutID) clearTimeout(this.timeoutID);

    if(this.music!==null){
      //this.game.sound.stop(this.music);
      this.game.music[this.music].stop();
    }

    this.played=true;
    this.hide();

    if(!this.game.finished)
    {
      this.game.resume();
    }else{
      this.game.home();
    }
  }

  adjust(){
    let ratio=this.image.width / this.image.height;
    this.image.height=this.game.height-this.field.height;
    this.image.width=this.image.height*ratio;

    this.image.x=this.game.width/2;
    this.field.x=this.game.width/2;
    this.field.y=this.game.height;

    if(this.container.width>this.game.width || this.container.height>this.game.height){
      this.scale();
    }
    this.center();
  }

  center(){
    this.container.x = this.game.width / 2;
    this.container.y = this.game.height  / 2;
    this.container.pivot.x = this.container.width / 2;
    this.container.pivot.y = this.container.height / 2;
  }

  scale(){
    let ratio = Math.min( this.game.width/this.container.width, this.game.height/this.container.height);
    this.container.scale.set(ratio);
  }

  setMusic(){
    if(this.config.Sequence[this.sequenceIndex].Music!==undefined && this.game.playSounds){
      if(this.music!==null){
        this.game.music[this.music].stop();
      }

      this.music=this.config.Sequence[this.sequenceIndex].Music;
      this.game.music[this.music].play(true);
    }
  }

}

export default CutScene;
