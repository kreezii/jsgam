class Scene{
  constructor(){
    this.container = new PIXI.Container();
    this.game=null;
  }

  setup(config){
    this.background=new PIXI.Sprite(PIXI.Texture.from(config.Background));
    this.background.anchor.set(0);
    this.container.addChild(this.background);
    if(config.Foreground!==undefined)
    {
      this.foreground=new PIXI.Sprite(PIXI.Texture.from(config.Foreground));
      this.foreground.anchor.set(0);
      this.container.addChild(this.foreground);
    }
    this.music=config.Music;
    this.config=config;
  }

  update(dt) {

  }
  hide(){
    this.container.visible=false;
  }

  show(){
    this.container.visible=true;
  }
}

export default Scene;
