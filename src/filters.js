import {GodrayFilter} from 'pixi-filters';


class Filters{
  constructor(game){
		this.game=game;
		this.filter=null;
		this.container=new PIXI.Container();
		this.container.width=this.game.width;
		this.container.height=this.game.height;
	/*	this.sprite=new PIXI.Sprite(PIXI.Texture.WHITE);
		this.sprite.width=this.game.width;
		this.sprite.height=this.game.height;
		this.container.addChild(this.sprite);
		this.sprite.alpha=0;*/
		this.container.parentLayer = this.game.layerBottom;
		this.game.app.stage.addChild(this.container);
  }

  start(style){
    if(style=="Sun"){
			this.filter=new GodrayFilter();
			this.game.activeScene.background.filters=[this.filter];
		//	this.container.filters=[this.filter,new PIXI.filters.AlphaFilter(0.1)];
		}
  }

	stop(){
		this.game.activeScene.background.filters=[];
		this.filter=null;
	}

  update(){
		this.filter.time += this.game.app.ticker.elapsedMS / 1000;
  }
}

export default Filters;
