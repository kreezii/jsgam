export default class Sound{
  constructor(){
    this.game=null;
    this.source=null;
    this.sprite=null;
  }

  play(loop,src){
    this.source.volume(1);
    if(loop!==undefined && loop!==null) this.source.loop(true);
    if(src!==undefined && src!==null) this.sprite=this.source.play(src);
    else this.source.play();
  }

  stop(){
    if(this.sprite!==null){
      this.source.once('fade', this.onFade.bind(this),this.sprite);
      this.source.fade(1,0,1000,this.sprite);
    }
    else{
      this.source.once('fade', this.onFade.bind(this));
      this.source.fade(1,0,1000);
    }
  }

  onFade(){
    if(this.sprite!==null){
      this.source.stop(this.sprite);
      this.source.volume(1,this.sprite);
      this.sprite=null;
    }else{
      this.source.stop();
      this.source.volume(1);
    }
  }

  duration(){
    let length=null;
    if(this.sprite!==null) length=this.source.duration(this.sprite);
    else length=this.source.duration();
    return length;
  }

}
