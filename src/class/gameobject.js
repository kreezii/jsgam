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

    //Texture to shwo when the object is inside the inventory
    if(this.config.Icon){
      this.icon=PIXI.Texture.from(this.config.Icon);
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

    this.holding=false;
    this.timeoutID;

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

  hold(){
    this.holding=true;
  }
  //Invisible object touch begins
  touchArea(event){
    if(this.game.activeObject===null && !this.game.player.lock){
      this.game.activeObject=this;
      this.interaction = event.data;
      this.action=null;
      if(this.timeoutID) clearTimeout(this.timeoutID);
      this.timeoutID=setTimeout(this.hold.bind(this), this.game.holdTime);
      this.touchedPos=this.interaction.getLocalPosition(this.game.app.stage);
    }
  }

  //Invisible object touch ends
  releaseArea(){
    if(this.timeoutID) clearTimeout(this.timeoutID);

    if(this.interaction){
      let moveTo=this.interaction.getLocalPosition(this.game.app.stage);
      if(collision(moveTo,this.sprite)){
        if(this.interaction.button===2 || this.holding){
          if(this.config.Door){
            let newPos=closestPoint(this.config.Area,moveTo);
            moveTo=newPos;
          }else if(this.config.Use!==undefined){
            this.game.activePuzzle=this.game.puzzles[this.config.Use];
          }
          this.action="Use";
        }else if(this.config.Door && this.config.Door.NoLook){
          this.action="Use";
        }else{
          this.action="Look";
       }
      }

      if(this.action!==null){
        this.game.player.endAction=this.action;
        if(this.config.InteractionPoint) moveTo={x:this.config.InteractionPoint[0],y:this.config.InteractionPoint[1]};
        this.game.player.move(moveTo);
      }else{
        this.cancel();
      }

      if(this.game.player.touched) this.game.player.touched=false;
      this.holding=false;
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
      if(this.timeoutID) clearTimeout(this.timeoutID);
      this.timeoutID=setTimeout(this.hold.bind(this), 1000);
      this.oldParent=this.sprite.parent;
      this.depthGroup=this.sprite.parentLayer;
      if(this.sprite.parentLayer !== this.game.layerUI) this.sprite.parentLayer = this.game.layerUI;
    }
  }

  //Object is being dragged
  move(){
    if (this.dragging && !this.config.Lock) {
      this.sprite.setParent(this.game.app.stage);
      var newPosition = this.interaction.getLocalPosition(this.sprite.parent);
      let bounds=this.sprite.getBounds();
      this.sprite.x = newPosition.x;
      this.sprite.y = newPosition.y;
      //We can only move the object inside the stage
    //if(newPosition.x>bounds.width/2 && newPosition.x<this.game.width-bounds.width/2) this.sprite.x = newPosition.x;
    //if(newPosition.y>bounds.height && newPosition.y<this.game.height) this.sprite.y = newPosition.y;
    }
  }

  //Object drag/touch ends
  release(){
    if(this.timeoutID) clearTimeout(this.timeoutID);

    if(this.interaction){
      let moveTo;
      if(this.config.InteractionPoint){
        moveTo={x:this.config.InteractionPoint[0],y:this.config.InteractionPoint[1]};
      }else{
        moveTo={x:this.posX,y:this.posY};
      }
      //Check if we take it
      if(collision(this.sprite,this.game.inventory.icon) && this.config.Take){
        this.action="Take";
        //Check if we look it
      }else if(this.interaction.button===2  || this.holding){
        if(this.config.Use!==undefined) this.game.activePuzzle=this.game.puzzles[this.config.Use];
        this.action="Use";
      }else if(this.config.Door!==undefined){
        if(this.config.Door.NoLook) this.action="Use";
      }else{
        this.action="Look";
      }

      if(this.game.player.touched) this.game.player.touched=false;

      this.sprite.x = this.posX;
      this.sprite.y = this.posY;
      this.sprite.alpha = 1;
      this.sprite.parentLayer = this.depthGroup;
      this.sprite.setParent(this.oldParent);

      this.holding=false;
      this.interaction = null;
      this.dragging = false;

      if(this.action!==null){
        this.game.player.endAction=this.action;
        this.game.player.move(moveTo);
      }else{
        this.cancel();
      }
    }
  }

  //Check collision between objects
  hit(){
    let found=null;
    let i;

    //First check the collision between active scene's objects
    let objectsArray=this.game.activeScene.config.Objects;
    if(objectsArray!==undefined){
      for(i=0;i<objectsArray.length;i++){
        if(collision(this.sprite,this.game.objects[objectsArray[i]].sprite)
                     && this.config.Name!==objectsArray[i]){
          found=objectsArray[i];
          break;
        }
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

    //Check the collision a character
    let charsArray=this.game.activeScene.config.Characters;
    if(charsArray!==undefined){
      for(i=0;i<charsArray.length;i++){
        if(collision(this.sprite,this.game.npcs[charsArray[i]].sprite)
                     && this.config.Name!==charsArray[i]){
          found=charsArray[i];
          break;
        }
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
  }
  //Remove objects from game
  remove(){
    this.sprite.parent.removeChild(this.sprite);

    //Check if we remove an object which is in an scene
    let scenesArray=Object.values(this.game.scenes)
    let i;
    let scenesLength=scenesArray.length;
    for(i=0;i<scenesLength;i++){
      if(scenesArray[i].config.Objects!==undefined && scenesArray[i].config.Objects.includes(this.config.Name)){
        let tmpIndex=scenesArray[i].config.Objects.indexOf(this.config.Name);
        scenesArray[i].config.Objects.splice(tmpIndex,1);
      }
    }

    //Check if the object to remove is inside the inventory
    if(this.game.inventory.objects.includes(this.config.Name)){
      this.game.inventory.remove(this.config.Name);
    }
  }

}

export default GameObject;
