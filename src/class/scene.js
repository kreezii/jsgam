class Scene{
  constructor(){
    this.container = new PIXI.Container();
    this.game=null;
  }

  setup(config){
    this.background=new PIXI.Sprite(PIXI.Texture.from(config.Background));
    this.background.anchor.set(0);
    this.container.addChild(this.background);
    this.music=config.Music;
    this.config=config;
  }

  update(dt) {

  }
}

export default Scene;
