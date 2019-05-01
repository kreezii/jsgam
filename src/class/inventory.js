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
      this.objects.push(name);
      this.game.objects[name].sprite.setParent(this.container);
      this.game.objects[name].sprite.removeAllListeners();
      this.game.objects[name].sprite.parentLayer=this.game.layerUI;
      this.game.objects[name].sprite.on('pointertap',this.look.bind(this.game.objects[name]))
                                    .on('pointerdown', this.touch.bind(this.game.objects[name]))
                                    .on('pointermove', this.move.bind(this.game.objects[name]))
                                    .on('pointerup', this.release.bind(this.game.objects[name]))
                                    .on('pointerupoutside', this.release.bind(this.game.objects[name]));
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

    look(){
      if(!this.moved){
        let text=this.config.Description[this.game.activeLanguage];
        this.game.player.say(text);
      }
    }

    touch(event){
      this.posX = this.sprite.x;
      this.posY = this.sprite.y;
      this.interaction = event.data;
      this.sprite.alpha = 0.5;
      this.dragging = true;
      this.moved = false;

    }

    move(){
      if (this.dragging) {
        this.moved=true;
        this.sprite.setParent(this.game.app.stage);
        var newPosition = this.interaction.getLocalPosition(this.sprite.parent);
        let bounds=this.sprite.getBounds();
        //We can only move the object inside the stage
        if(newPosition.x>bounds.width/2 && newPosition.x<this.game.width-bounds.width/2) this.sprite.x = newPosition.x;
        if(newPosition.y>bounds.height && newPosition.y<this.game.height) this.sprite.y = newPosition.y;
        if(!boxesIntersect(this.sprite,this.game.inventory.container)){
          this.game.inventory.container.visible=false;
        }

      }
    }

    release(){
        if(this.interaction){

          // set the interaction data to null
          this.interaction = null;
          this.dragging = false;
          let isPuzzle=this.game.getPuzzle(this.config.Name);
          if(isPuzzle>=0){
            this.game.puzzles[isPuzzle].resolvePuzzle();
          }

          this.sprite.setParent(this.game.inventory.container);
          this.sprite.x = this.posX;
          this.sprite.y = this.posY;
          this.sprite.alpha = 1;

        }
    }
}

export default Inventory;
