import {boxesIntersect,collision,closestPoint} from '../collisions.js';

class GameObject{
  constructor(){
    this.sprite=null;
    this.game=null;
    this.action=null;
  }

  build(){
    if(this.config.Description===undefined){
      this.config.Description=this.game.data.texts.NoDescription;
    }
    //Configure the sprite's object
    if(this.config.Texture){
      //Generate a static object from a texture
      this.sprite=new PIXI.Sprite.from(PIXI.Texture.from(this.config.Texture));

    }else if(this.config.Area){

      //For invisible objects
      this.sprite=new PIXI.Sprite.from(PIXI.Texture.EMPTY);
      this.sprite.hitArea=new PIXI.Polygon(this.config.Area);

    }else if(this.config.Animation){

      //Animated objects
      let spritesheet=this.game.files.resources[this.config.Animation.Name].spritesheet;

      let frames = [];
      for (var i = 0; i < spritesheet._frameKeys.length; i++) {
          frames.push(PIXI.Texture.from(spritesheet._frameKeys[i]));
      }

      this.sprite=new PIXI.extras.AnimatedSprite(frames);
      this.animationSpeed=this.config.Animation.Speed;
      this.play();
    }

    //Position of the object in the screen
    if(this.config.Position){
      this.sprite.x=this.config.Position[0];
      this.sprite.y=this.config.Position[1];
    }

    //Size of the object
    if(this.config.Size){
      this.sprite.scale.set(this.config.Size)
    }

    if(this.config.Mirror){
      this.flip();
    }

    //Configure the anchor (origin point of the object)
    if(!this.config.Area)this.sprite.anchor.set(0.5,1);

    //Configure the layer for the z-order
    if(this.config.Layer==="Top") this.sprite.parentLayer=this.game.layerTop;
    else if(this.config.Layer==="Bottom") this.sprite.parentLayer=this.game.layerBottom;
    else this.sprite.parentLayer = this.game.layer;

    //Is it a door?
    if(this.config.Door){
      this.door=true;
      this.newScene=this.config.Door.To;
      this.playerPos=this.config.Door.Player;
    }

    //Game object events
    this.sprite.interactive=true;
    this.sprite.buttonMode=true;

    if(this.config.Area!==undefined){
      this.sprite.on('pointerdown', this.touchArea.bind(this))
          .on('pointerup', this.releaseArea.bind(this))
          .on('pointerupoutside', this.releaseArea.bind(this));
    }else{
      this.sprite.on('pointerdown', this.touch.bind(this))
          .on('pointermove', this.move.bind(this))
          .on('pointerup', this.release.bind(this))
          .on('pointerupoutside', this.release.bind(this));
    }

    if(this.config.Interactive!==undefined) this.setInteraction(this.config.Interactive);
  }

  hide(){
    this.sprite.visible=false;
  }

  show(){
    this.sprite.visible=true;
  }

  setpos(x,y){
    this.sprite.x=x;
    this.sprite.y=y;
  }

  flip(){
    this.sprite.scale.x*=-1;
  }

  changeTexture(texture){
    this.sprite.texture=new PIXI.Texture.from(texture)
  }
  //Invisible object touch begins
  touchArea(event){
    if(this.game.activeObject===null && !this.game.player.lock){
      this.game.activeObject=this;
      this.interaction = event.data;
      this.action=null;
      this.touchedPos=this.interaction.getLocalPosition(this.game.app.stage);
    }
  }

  //Invisible object touch ends
  releaseArea(){
    if(this.interaction){
      let moveTo=this.interaction.getLocalPosition(this.game.app.stage);
      if(collision(moveTo,this.sprite)){
         this.look();
      }else if(this.door===true){
        let newPos=closestPoint(this.config.Area,moveTo);
        moveTo=newPos;
        this.use();
      }
      if(this.action!==null){
        this.game.player.tween.once('end',this.action);
        this.game.player.move(moveTo);
      }else{
        this.cancel();
      }

      this.interaction = null;
      this.touchedPos=null;
    }
  }

  //Object touch begins
  touch(event){
    if(this.game.activeObject===null && !this.game.player.lock){
      this.game.activeObject=this;
      this.action=null;
      this.posX = this.sprite.x;
      this.posY = this.sprite.y;
      this.interaction = event.data;
      this.sprite.alpha = 0.5;
      this.dragging = true;
      this.moved = 0;
      this.oldParent=this.sprite.parent;
      this.depthGroup=this.sprite.parentLayer;
      if(this.sprite.parentLayer !== this.game.layerUI) this.sprite.parentLayer = this.game.layerUI;
    }
  }

  //Object is being dragged
  move(){
    if (this.dragging) {
      this.moved++;
      this.sprite.setParent(this.game.app.stage);
      var newPosition = this.interaction.getLocalPosition(this.sprite.parent);
      let bounds=this.sprite.getBounds();
      //We can only move the object inside the stage
      if(newPosition.x>bounds.width/2 && newPosition.x<this.game.width-bounds.width/2) this.sprite.x = newPosition.x;
      if(newPosition.y>bounds.height && newPosition.y<this.game.height) this.sprite.y = newPosition.y;
    }
  }

  //Object drag/touch ends
  release(){
    if(this.interaction){
      let moveTo={x:this.posX,y:this.posY};
      //Check if we take it
      if(collision(this.sprite,this.game.inventory.icon) && this.config.Take){
        this.take();
        //Check if we look it
      }else if(this.moved<3){
        this.look();
      }else if(this.config.door===true){
        this.use();
      }else if(this.config.Use!==undefined){
        this.game.activePuzzle=this.game.puzzles[this.config.Use];
        this.use();
      }

      if(this.action!==null){
        this.game.player.tween.once('end',this.action);
        this.game.player.move(moveTo);
      }else{
        this.cancel();
      }

      this.sprite.x = this.posX;
      this.sprite.y = this.posY;
      this.sprite.alpha = 1;
      this.sprite.parentLayer = this.depthGroup;
      this.sprite.setParent(this.oldParent);

      this.interaction = null;
      this.dragging = false;
      this.moved=0;
    }
  }

  //Set player to look this object
  look(){
    this.action=this.game.player.look.bind(this.game.player);
  }

  //Set player to take this object
  take(){
    this.action=this.game.player.take.bind(this.game.player);
  }

  //Set player to use this object
  use(){
    this.action=this.game.player.use.bind(this.game.player);
  }

  //Check collision between objects
  hit(){
    let found=null;
    let i;

    //First check the collision between active scene's objects
    let objectsArray=this.game.activeScene.config.Objects;

    for(i=0;i<objectsArray.length;i++){
      if(collision(this.sprite,this.game.objects[objectsArray[i]].sprite)
                   && this.config.Name!==objectsArray[i]){
        found=objectsArray[i];
        break;
      }
    }

    //Check if the collision is between inventory objects
    objectsArray=this.game.inventory.objects;

    for(i=0;i<objectsArray.length;i++){
      if(collision(this.sprite,this.game.objects[objectsArray[i]].sprite)
                   && this.config.Name!==objectsArray[i]){
        found=objectsArray[i];
        break;
      }
    }

    return found;
  }

  //Object action is canceled or ended
  cancel(){
    this.game.activeObject.action=null;
    this.game.activeObject=null;

  }

  setInteraction(value){
    this.sprite.interactive=value;
  }

  //Add the object to a given scene
  add(scene){
    this.game.scenes[scene].container.addChild(this.sprite);
    this.game.scenes[scene].config.Objects.push(this.config.Name);
    this.game.scenes[scene].config.Objects;
  }
  //Remove objects from game
  remove(){
    this.sprite.parent.removeChild(this.sprite);
    //POR HACER
    //Quitar el objeto de la cadena de objetos de la escena
    //Quitar del inventario en caso de que esté ahí
  }

}

export default GameObject;
