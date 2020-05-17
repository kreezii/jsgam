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
      if(this.game.settings.Inventory.Border) this.border=this.game.settings.Inventory.Border;
      this.icon=new PIXI.Sprite(PIXI.Texture.from(this.game.settings.Inventory.Icon));
      this.icon.on('pointertap',this.click.bind(this));
      this.icon.interactive=true;
      this.icon.buttonMode=true;
      this.setIcon(this.game.settings.Inventory.Position);
      this.container.addChild(this.background);
      this.icon.parentLayer = this.game.layerUI;

      //Hidden by default
      this.hide();
      this.hideIcon();
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
      }else if(position=="bottom-left"){
        this.icon.x=0;
        this.icon.y=this.game.height - this.icon.height;
      }else if(position=="top-left"){
        this.icon.x=this.game.width - this.icon.width;
        this.icon.y=0;
      }
    }

    click(){
      if (this.container.visible) this.hide();
      else if(!this.game.player.lock) this.show();
    }

    add(name){
      if(!this.objects.includes(name)){
        this.objects.push(name);
        this.game.objects[name].sprite.setParent(this.container);
        this.game.objects[name].sprite.parentLayer=this.game.layerUI;
        this.game.objects[name].sprite.on('pointermove', this.move.bind(this.game.objects[name]))
                                      .off('pointerup')
                                      .off('pointerupoutside')
                                      .on('pointerup',this.release.bind(this.game.objects[name]))
                                      .on('pointerupoutside',this.release.bind(this.game.objects[name]));
        if(this.game.objects[name].icon!==undefined) this.game.objects[name].sprite.texture=this.game.objects[name].icon;
        this.update();
      }
    }

    remove(name)
    {
      //Check if object is already in inventory
      if(this.objects.includes(name)){
        this.objects.splice(this.objects.indexOf(name),1);
        this.container.removeChild(this.game.objects[name].sprite);
        this.update();
      }
    }

    update(){
      //Inventory is limited to 25 objects
      let i;
      let numObjs=this.objects.length;
      for(i=0;i<numObjs;i++){
        let tmpObj=this.game.objects[this.objects[i]].sprite;

        let desiredWidth=this.background.width/5-this.background.width*0.05;
        let desiredHeight=this.background.height/5-this.background.height*0.05;
        let ratio = Math.min( desiredWidth/tmpObj.width, desiredHeight/tmpObj.height);
        tmpObj.width*=ratio;
        tmpObj.height*=ratio;

        tmpObj.x = ((i % 5) * this.background.width/5+this.border-i)+tmpObj.width/2;
        tmpObj.y = (Math.floor(i / 5) * this.background.height/5+this.border-i)+tmpObj.height;
      }
    }

    move(){
      if(!boxesIntersect(this.sprite,this.game.inventory.background))
        this.game.inventory.hide();
    }

    release(event){
      let combineInventory=false;

      if(this.timeoutID) clearTimeout(this.timeoutID);

      if(this.interaction){
        let objectHit=this.hit();

        let moveTo={x:this.sprite.x,y:this.sprite.y};
        //Check if we take it
        if(!this.holding){
          let voice=undefined;
          if(this.config.VoiceDescription!==undefined){
            voice=this.config.VoiceDescription[this.game.activeLanguage];
          }
          this.game.player.say(this.config.Description[this.game.activeLanguage],voice);

        }else if(this.config.Combine!==undefined && objectHit!==null){
          if(this.config.Combine.With===objectHit) {
            if(this.game.inventory.objects.includes(this.config.Combine.With)) combineInventory=true;
            this.game.activePuzzle=this.game.puzzles[this.config.Combine.Puzzle];
          }
          if(!combineInventory) this.action="Use";
        }
/*
        if(this.action!==null){
          this.game.player.endAction=this.action;
          this.game.player.move(moveTo);
        }else if(combineInventory){
          this.game.activePuzzle.resolve();
        }else{
          this.cancel();
        }
*/
        this.sprite.x = this.posX;
        this.sprite.y = this.posY;
        this.sprite.alpha = 1;
        this.sprite.setParent(this.oldParent);

        this.interaction = null;
        this.dragging = false;
        this.holding=false;
        
        if(this.action!==null){
          this.game.player.endAction=this.action;
          this.game.player.move(moveTo);
        }else if(combineInventory){
          this.game.activePuzzle.resolve();
        }else{
          this.cancel();
        }
      }
    }
}

export default Inventory;
