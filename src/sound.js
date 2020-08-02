//JSGAM sound library

export default class Sound{
  constructor(){
    this.game=null;
    this.source=null;
    this.sprite=null;
    this.id=null;
  }

  play(loop,src){
    if(this.game.playSounds){
      this.source.volume(1);
      if(this.id!==null) this.source.play(this.id);
      else this.id=this.source.play();

      if(loop!==undefined && loop!==null) this.source.loop(true,this.id);
      if(src!==undefined && src!==null) this.sprite=this.source.play(src);

    }
  }

  stop(){
    if(this.game.playSounds){
      if(this.sprite!==null){
        this.source.once('fade', this.onFade.bind(this),this.sprite);
        this.source.fade(1,0,1000,this.sprite);
      }
      else{
        this.source.once('fade', this.onFade.bind(this),this.id);
        this.source.fade(1,0,1000);
      }
    }
  }

  onFade(){
    if(this.game.playSounds){
      if(this.sprite!==null){
        this.source.stop(this.sprite);
        this.source.volume(1,this.sprite);
        this.sprite=null;
      }else if(this.id!==null){
        this.source.stop(this.id);
        this.source.volume(1);
      }
    }
  }

  duration(){
    let length=null;
    if(this.sprite!==null) length=this.source.duration(this.sprite);
    else length=this.source.duration();
    return length;
  }

}
