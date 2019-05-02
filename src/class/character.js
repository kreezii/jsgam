import dragonBones from 'dragonbones-pixi';
import tweenManager from 'k8w-pixi-tween';
const dbfactory=dragonBones.dragonBones.PixiFactory.factory;
import {checkPath} from '../collisions.js'

class Character{
  constructor(){
    this.game=null;
    this.state=null;
    this.lock=false;
  }

  setup(config){
    dbfactory.parseDragonBonesData(config.Skeleton);
    dbfactory.parseTextureAtlasData(config.Json,config.Texture);
    this.sprite = dbfactory.buildArmatureDisplay(config.Armature);
    this.tween=PIXI.tweenManager.createTween(this.sprite);
    this.tween.on('end', this.stop.bind(this));
    if(config.Animations!=undefined)
      this.animations=config.Animations;
    else
      this.animations={
        Stand:"stand",
        Walk:"walk",
        Take:"take",
        Use:"use",
        Say:"speak"
      };
    this.animate(this.animations.Stand);
    this.state="stand";
    this.sprite.parentLayer = this.game.layer;//Z-order*/
    this.sprite.x=500;
    this.sprite.y=600;
    this.config=config.data;
  }

  move(coords){
    let obstacles=this.game.activeScene.config.Obstacles;
    let walkingArea=this.game.activeScene.config.WalkArea;
    let newPosition=coords;
    let closestPosition=checkPath(coords,obstacles,walkingArea);

    if(closestPosition){
      newPosition=closestPosition;
    }

    let path = new PIXI.tween.TweenPath();
    let findPath=this.game.activeScene.walkable.findPath(this.sprite.x,this.sprite.y,newPosition.x,newPosition.y,0);

    if(findPath.length>0){
      this.tween.stop().clear();
      this.animate(this.animations.Walk);
      if(this.sprite.x<newPosition.x) this.sprite.armature.flipX=false;
      else this.sprite.armature.flipX=true;
      path.drawShape(new PIXI.Polygon(findPath));
      this.tween.path=path;

      //Needs improvement
      let animationTime=Math.abs(this.sprite.x-newPosition.x)*5+Math.abs(this.sprite.y-newPosition.y)*5+findPath.length*100;

      this.tween.time = animationTime;
      this.tween.speed = 1;
      this.tween.delay=10;
      this.tween.start();
    }
  }

  update(){
    PIXI.tweenManager.update();
  }

  stop(){
    this.animate(this.animations.Stand);
    this.game.activeState=null;
  }

  say(text){
    //Lock the player
    this.lock=true;

    //Setup the text to show
    this.game.textField.setText(text);
    this.game.textField.setColor(this.config.Color);
    this.game.textField.show();

    //Animate the character
    this.animate(this.animations.Say);
    if(this.timeoutID) clearTimeout(this.timeoutID);
    this.timeoutID=setTimeout(this.game.textField.skip.bind(this.game.textField), this.game.textField.timeOut());
  }

  animate(animation,times){
    if(this.sprite.animation.lastAnimationName!==animation)
      this.sprite.animation.fadeIn(animation,0.25,times);
  }
}

export default Character;
