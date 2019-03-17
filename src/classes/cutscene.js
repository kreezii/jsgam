import {game} from '../game.js';

export class CutScene{
  constructor(data,index){
    this.container=new PIXI.Container();
    this.container.visible=false;
    this.sequenceIndex=0;
    this.data=data;
    this.index=index;
    this.played=false;

    if(data.Video){
      this.videoData = PIXI.loader.resources[data.Video].data;
      this.videoData.onended=endVideo;
    }else if(data.Sequence){
      this.image=new PIXI.Sprite(PIXI.Texture.from(data.Sequence[this.sequenceIndex].Image));
      var ratio = Math.min( game.width/this.image.width,  game.height/this.image.height);
      this.image.scale.set(ratio/2);

      this.container.interactive=true;
      this.container.buttonMode=true;
      this.container.on('pointertap',nextElement);

      this.container.addChild(this.image);

      this.field=new PIXI.Text(this.data.Sequence[this.sequenceIndex].Text[game.mainLanguage], game.settings.TextStyle);
      this.field.anchor.set(0.5,0);
      this.field.x=this.image.width/2;
      this.field.y=this.image.height+this.field.height/2;

      this.container.addChild(this.field);

      this.container.x = (game.width - this.image.width) / 2;
      this.container.y = (game.height - this.image.height) / 2;
    }
  }

  show(){
      this.container.visible=true;
      if(this.data.Video) {
        let videoTexture = PIXI.Texture.from(this.videoData);
      	this.videoSprite = new PIXI.Sprite(videoTexture);
        this.videoSprite.width = game.width;
        this.videoSprite.height = game.height;
        this.videoSprite.interactive=true;
        this.videoSprite.buttonMode=true;
        this.videoSprite.on('pointertap',endVideo);
        this.container.addChild(this.videoSprite);
      }
      else if(this.data.Sequence) this.timeout = PIXI.setTimeout(this.data.Sequence[this.sequenceIndex].Time,nextElement);
  }

  hide(){
      this.container.visible=false;
  }

  next(){
    this.timeout.clear();
    if(this.sequenceIndex<this.data.Sequence.length-1){
      this.sequenceIndex+=1;
      this.field.text=this.data.Sequence[this.sequenceIndex].Text[game.mainLanguage];
      this.image.texture=(PIXI.Texture.from(this.data.Sequence[this.sequenceIndex].Image));
      this.timeout = PIXI.setTimeout(this.data.Sequence[this.sequenceIndex].Time,nextElement);
    }else{
      this.end();
    }
  }

  end(){
    this.hide();
    if(this.videoSprite!=undefined) this.videoSprite.destroy();
    this.played=true;
    game.scenes[game.currentScene].show();
    game.currentCutscene=null;

  }
};

function endVideo(){
  if(game.currentCutscene!=null) game.cutscenes[game.currentCutscene].end();
}

function nextElement(){
  if(game.currentCutscene!=null) game.cutscenes[game.currentCutscene].next();
}
