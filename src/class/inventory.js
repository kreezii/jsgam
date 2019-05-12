import {boxesIntersect,collision} from '../collisions.js';

class Inventory{
  constructor(){
      this.container=new PIXI.Container();
      this.container.visible=false;
      this.game=null;
      this.objects=[];

    }

    build(){
      this.background=new PIXI.Sprite(PIXI.Texture.from(this.game.settings.Inventory.Background));
      this.background.width=this.game.width/2;
      this.background.height=this.game.height/2;
      this.background.parentLayer = this.game.layerUI;
      this.container.x = (this.game.width - this.background.width) / 2;
      this.container.y = (this.game.height - this.background.height) / 2;
      this.border=10;
      this.icon=new PIXI.Sprite(PIXI.Texture.from(this.game.settings.Inventory.Icon));
      this.icon.on('pointertap',this.click.bind(this));
      this.icon.interactive=true;
      this.icon.buttonMode=true;
      this.setIcon(this.game.settings.Inventory.Position);
      this.container.addChild(this.background);
      this.icon.parentLayer = this.game.layerUI;
    }

    show(){
      this.update();
      this.container.visible=true;
    }

    hide(){
      this.container.visible=false;

    }

    showIcon(){
      this.icon.visible=true;
    }

    hideIcon(){
      this.icon.visible=false;

    }

    setIcon(position){
      if(position=="bottom-right"){
        this.icon.x=this.game.width - this.icon.width;
        this.icon.y=this.game.height - this.icon.height;
      }else if(position=="top-right"){
        this.icon.x=this.game.width - this.icon.width;
        this.icon.y=0;
      }else if(position=="top-left"){
        this.icon.x=0;
        this.icon.y=this.game.height - this.icon.height;
      }else if(position=="bottom-top"){
        this.icon.x=this.game.width - this.icon.width;
        this.icon.y=0;
      }
    }

    click(){
      if (this.container.visible) this.hide();
      else if(!this.game.player.lock) this.show();
    }

    add(name){
      if(this.game.activeScene!==null){
        if(this.game.activeScene.config.Objects.includes(name)){
          let tmpIndex=this.game.activeScene.config.Objects.indexOf(name);
          this.game.activeScene.config.Objects.splice(tmpIndex,1);
        }
      }
      this.objects.push(name);
      this.game.objects[name].sprite.setParent(this.container);
      this.game.objects[name].sprite.parentLayer=this.game.layerUI;
      this.game.objects[name].sprite.on('pointermove', this.move.bind(this.game.objects[name]))
                                    .off('pointerup')
                                    .off('pointerupoutside')
                                    .on('pointerup',this.release.bind(this.game.objects[name]))
                                    .on('pointerupoutside',this.release.bind(this.game.objects[name]));
      this.update();
    }

    remove(name)
    {
      //Check if object is already in inventory
      if(this.objects.includes(name)){
        this.objects.splice(this.objects.indexOf(name),1);
        this.update();
      }
    }

    update(){
      let i;
      let numObjs=this.objects.length;
      for(i=0;i<numObjs;i++){
        let tmpObj=this.game.objects[this.objects[i]].sprite;

        tmpObj.width=this.container.width/5-this.container.width*0.05;
        tmpObj.height=this.container.height/5-this.container.height*0.05;
        tmpObj.x = ((i % 5) * this.container.width/5+this.border-i)+tmpObj.width/2;
        tmpObj.y = (Math.floor(i / 5) * this.container.height/5+this.border-i)+tmpObj.height;
        this.container.width=this.background.width;
        this.container.height=this.background.height;
      }
    }

    move(){
      if(!boxesIntersect(this.sprite,this.game.inventory.container))
        this.game.inventory.hide();
    }

    release(event){
      if(this.interaction){
        let objectHit=this.hit();

        let moveTo={x:this.sprite.x,y:this.sprite.y};
        //Check if we take it
        if(this.moved<3){
          this.game.player.say(this.config.Description[this.game.activeLanguage])
        }else if(this.config.Combine!==undefined && objectHit!==null){
          if(this.config.Combine.With===objectHit) {
            this.game.activePuzzle=this.game.puzzles[this.config.Combine.Puzzle];
          }
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
        this.sprite.setParent(this.oldParent);

        this.interaction = null;
        this.dragging = false;
        this.moved=0;
      }
    }
}

export default Inventory;
