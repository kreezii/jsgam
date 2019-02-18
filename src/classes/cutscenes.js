import {game} from '../game.js';

var textStyle = new PIXI.TextStyle({
  align: "center",
  dropShadow: true,
  dropShadowAlpha: 0.5,
  dropShadowBlur: 5,
  dropShadowDistance: 2,
  fill: "white",
  fontFamily: "\"Palatino Linotype\", \"Book Antiqua\", Palatino, serif",
  fontSize: 25,
  fontWeight: "bold"
  //wordWrapWidth: game.width
});

export class gameCutscene{
  constructor(data,index){
    this.container=new PIXI.Container();
    this.container.visible=false;
    this.sequenceIndex=0;
    this.data=data;
    this.index=index;

    if(data.Video){
      /*
      var texture = PIXI.Texture.fromVideo('/demo/sources/video.mp4');

      // create a new Sprite using the video texture (yes it's that easy)
      var videoSprite = new PIXI.Sprite(texture);
      videoSprite.anchor.set(0,0);
      videoSprite.x=0;
      videoSprite.y=0;
      videoSprite.on('pointertap',function(){})
      console.log(texture.source);
      // Stetch the fullscreen
      videoSprite.width = this.app.screen.width;
      videoSprite.height = this.app.screen.height;
      this.background.on('pointertap',skipVideo);
      this.container.addChild(videoSprite);
      texture.source.onended=skypVideo;
      */
    }else if(data.Sequence){
      this.image=new PIXI.Sprite(PIXI.Texture.fromFrame(data.Sequence[this.sequenceIndex].Image));
      var ratio = Math.min( game.width/this.image.width,  game.height/this.image.height);
      this.image.scale.set(ratio);

      this.image.interactive=true;
      this.image.buttonMode=true;
      this.image.on('pointertap',nextElement);

      this.container.addChild(this.image);

      this.Field=new PIXI.Text("", textStyle);
      this.Field.anchor.set(0.5,0);
      this.Field.x=game.width/2;
      this.Field.y=this.image.height+this.Field.height/2;

      this.container.addChild(this.Field);
    }
  }

  next(){

  }

  gotoScene(){

  }

  end(){

  }
};

function skipVideo(){

}

function nextElement(){
  let thisCutscene=game.cutscenes[game.currentCutscene];

  if(thisCutscene.sequenceIndex<thisCutscene.data.Sequence.length-1){
    thisCutscene.sequenceIndex+=1;
    thisCutscene.image.texture(PIXI.Texture.fromFrame(thisCutscene.data.Sequence[thisCutscene.sequenceIndex].Image));
  }else{
    thisCutscene.end();
  }
}
