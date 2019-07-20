export default class SoundManager{
  constructor(game){
    this.game=game;
  }

  play(source){
    let sound=this.game.files.resources[source].sound;
    sound.loop(true);
    sound.play();
  }

  stop(source){
    let sound=this.game.files.resources[source].sound;
    sound.on('fade', this.onFade.bind(sound));
    sound.fade(1,0,1000);
  }

  onFade(){
    this.stop();
    this.volume(1);
  }

}
