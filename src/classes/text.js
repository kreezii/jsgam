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

export class Text{
  constructor(){
    this.container=new PIXI.Container();

    this.Background=new PIXI.Sprite(PIXI.Texture.WHITE);
    this.Background.width=game.width;
    this.Background.height=game.height/4;
    this.Background.tint='black';
    this.Background.alpha=0.5;

    this.Text=new PIXI.Text("", textStyle);
    this.Text.anchor.set(0.5,0);
    this.Text.x=game.width/2;
    this.Text.y=0;

    this.container.addChild(this.Background);
    this.container.addChild(this.Text);
  //  this.container.y=game.height-this.container.height;
    this.container.visible=false;
    this.container.parentLayer = game.layerUI;
    }

    hide(){
      this.container.visible=false;
    }

    show(){
      this.container.visible=true;
    }
};
