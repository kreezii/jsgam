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
    dbfactory.parseDragonBonesData(this.game.files.resources[config.Name+"Skeleton"].data);
    dbfactory.parseTextureAtlasData(this.game.files.resources[config.Name+"Json"].data,this.game.files.resources[config.Name+"Tex"].texture);
    this.sprite = dbfactory.buildArmatureDisplay(config.Armature);
    if(config.Size){
      this.size=config.Size;
      this.sprite.scale.set(this.size);
    }else{
      this.size=1;
    }
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
    this.sprite.x=500;
    this.sprite.y=500;
    this.sprite.parentLayer = this.game.layer;//Z-order*/
    this.config=config;
  }

  hide(){
    this.sprite.visible=false;
  }

  show(){
    this.sprite.visible=true;
  }

  position(coords){
    this.sprite.x=coords[0];
    this.sprite.y=coords[1];
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
    this.scale();
  }

  scale(){
    let scaleChar=this.sprite.y/this.game.height*this.size;
    if(scaleChar<this.game.activeScene.config.Depth) scaleChar=this.game.activeScene.config.Depth;
    this.sprite.scale.set(scaleChar);
  }

  stop(){
    this.animate(this.animations.Stand);
    this.game.activeState=null;
    this.lock=false;
  }

  say(text){
    this.game.textField.talker=this;
    //Setup the text to show
    this.game.textField.setText(text);
    this.game.textField.setColor(Number(this.config.Color));
    this.game.textField.show();

    //Animate the character
    this.animate(this.animations.Say);
    if(this.timeoutID) clearTimeout(this.timeoutID);
    this.timeoutID=setTimeout(this.game.textField.end.bind(this.game.textField), this.game.textField.timeOut());
  }

  shutup(){
    this.animate(this.animations.Stand);
  }

  animate(animation,times){
    if(this.sprite.animation.lastAnimationName!==animation)
      this.sprite.animation.fadeIn(animation,0.25,times);
  }
}

export default Character;
