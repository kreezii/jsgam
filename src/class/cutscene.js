import { gsap } from "gsap";

class CutScene{
  constructor(game){
    this.game=game;
    this.container=new PIXI.Container();
    this.music=null;
    this.voice=null;
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
      if(this.config.Sequence[this.sequenceIndex].Image) this.image=new PIXI.Sprite(PIXI.Texture.from(this.config.Sequence[this.sequenceIndex].Image));
      else this.image=new PIXI.Sprite(PIXI.Texture.EMPTY);

      this.container.interactive=true;
      this.container.buttonMode=true;
      this.container.on('pointertap',this.next.bind(this));
      this.container.addChild(this.image);
      this.field=new PIXI.BitmapText(this.config.Sequence[this.sequenceIndex].Text[this.game.activeLanguage],this.game.settings.Text.Style);
      this.field.anchor.set(0.5,1);
      this.field.maxWidth=this.game.width*.95;
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
      this.update();
      this.adjust();
      this.setMusic();
      this.setVoice();
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
      //this.field.text=this.config.Sequence[this.sequenceIndex].Text[this.game.activeLanguage];
      if(this.config.Sequence[this.sequenceIndex].Image)
        this.image.texture=(PIXI.Texture.from(this.config.Sequence[this.sequenceIndex].Image));
      this.update();
      this.adjust();
      this.setMusic();
      this.setVoice();
      this.fadeIn();
    }else{
      this.end();
    }
  }

  fadeIn(){
    if(this.tween) this.tween.kill();

    this.tween=gsap.fromTo(this.container, {alpha:0}, {duration:1, alpha:1, onComplete:this.timer.bind(this)});
  }

  timer(){
    this.timeoutID = setTimeout(this.fadeOut.bind(this), this.config.Sequence[this.sequenceIndex].Time*1000);
  }

  fadeOut(){
    if(this.tween) this.tween.kill();
    this.tween=gsap.fromTo(this.container, {alpha:1}, {duration:1, alpha:0, onComplete:this.next.bind(this)});
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
    this.field.x=this.game.width/2;
    let currentSequence=this.config.Sequence[this.sequenceIndex];

    if(currentSequence.Position==="Top"){
      this.field.anchor.set(0.5,0);
      this.field.y=0;
    }else if(currentSequence.Position==="Center"){
      this.field.anchor.set(0.5,0.5);
      this.field.y=this.game.height/2;
    }else{
      this.field.anchor.set(0.5,1);
      this.field.y=this.game.height;
    }
  }

  setMusic(){
    if(this.config.Sequence[this.sequenceIndex].Music!==undefined){
      if(this.music!==null){
        this.game.music[this.music].stop();
      }

      this.music=this.config.Sequence[this.sequenceIndex].Music;
      this.game.music[this.music].play(true);
    }
  }

  update(){
    let currentSequence=this.config.Sequence[this.sequenceIndex];
    this.field.text=currentSequence.Text[this.game.activeLanguage];
    if(currentSequence.Size!==undefined) this.field.fontSize=currentSequence.Size;
  }

  setVoice(){
    if(this.voice!==null){
      this.game.voices[this.config.VoiceSet].stop();
      this.voice=null;
    }

    if(this.config.Sequence[this.sequenceIndex].Voice!==undefined){
      this.voice=this.config.Sequence[this.sequenceIndex].Voice[this.game.activeLanguage];
      this.game.voices[this.config.VoiceSet].play(null,this.voice);
    }
  }

}

export default CutScene;
