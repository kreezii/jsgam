import * as PIXIParticles from 'pixi-particles';

var dust={
	"alpha": {
		"start": 0.4,
		"end": 0
	},
	"scale": {
		"start": 0.25,
		"end": 0.1,
		"minimumScaleMultiplier": 1
	},
	"color": {
		"start": "#ffffff",
		"end": "#ffffff"
	},
	"speed": {
		"start": 50,
		"end": 50,
		"minimumSpeedMultiplier": 1
	},
	"acceleration": {
		"x": 0,
		"y": 0
	},
	"maxSpeed": 0,
	"startRotation": {
		"min": 0,
		"max": 360
	},
	"noRotation": false,
	"rotationSpeed": {
		"min": 0,
		"max": 0
	},
	"lifetime": {
		"min": 2,
		"max": 1.8
	},
	"blendMode": "normal",
	"frequency": 0.5,
	"emitterLifetime": -1,
	"maxParticles": 1000,
	"pos": {
		"x": 0.5,
		"y": 0.5
	},
	"addAtBack": true,
	"spawnType": "rect",
	"spawnRect": {
		"x": 0,
		"y": 0,
		"w": 0,
		"h": 0
	}
};

class Particles{
  constructor(game){
		this.game=game;
		this.emitter=null;
		this.container=new PIXI.Container();
		this.game.app.stage.addChild(this.container);
		this.container.parentLayer = this.game.layerTop;
  }

  start(style){
		let texture;
		if(style=="Dust"){
			texture=PIXI.Texture.from('particle.png');
			dust.spawnRect.w=this.game.width;
			dust.spawnRect.h=this.game.height;
			this.params=dust;
		}
		this.emitter=new PIXIParticles.Emitter(this.container,texture,this.params);
    //this.elapsed=Date.now();
    this.emitter.emit=true;
  }

	stop(){
		this.emitter.emit=false;
		this.emitter=null;
	}

  update(){
    //this.now = Date.now();
		//this.emitter.update((this.now - this.elapsed) * 0.001);
		this.emitter.update(this.game.app.ticker.elapsedMS / 1000);
		//this.elapsed=this.now;
  }
}

export default Particles;
