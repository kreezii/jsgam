import {GodrayFilter,AdjustmentFilter,ReflectionFilter} from 'pixi-filters';

class Filters{
  constructor(game){
		this.game=game;
		this.filter=null;
		this.container=new PIXI.Container();
		this.container.width=this.game.width;
		this.container.height=this.game.height;
		this.container.parentLayer = this.game.layerBottom;
		this.game.app.stage.addChild(this.container);
  }

  start(style){
    this.style=style;
    if(style=="Sun"){
			this.filter=new GodrayFilter({alpha:.5});
			this.game.activeScene.background.filters=[this.filter];
    }else if(style=="Heat"){
			this.filter=new ReflectionFilter(
        {
          mirror:false,
          boundary:0,
          amplitude:[1,1]
        });
			this.game.activeScene.background.filters=[this.filter];
    }else if(style="Night"){
      let config={
        brightness: .8,
        red: .25,
        green: .25,
        blue: .8
      };
      this.filter=new AdjustmentFilter(config);
      this.game.layerBottom.filters=[this.filter];
      this.game.layer.filters=[this.filter];
      this.game.layerTop.filters=[this.filter];
    }
  }

	stop(){
		this.game.activeScene.background.filters=[];
		this.filter=null;
    this.style=null;
	}

  update(){
		if(this.style=="Sun" || this.style=="Heat") this.filter.time += this.game.app.ticker.elapsedMS / 1000;
  }
}

export default Filters;
