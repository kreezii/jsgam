import {game} from '../game.js';

export class gameObject{
  constructor(data,index){
    this.name=data.Name;
    this.index=index;
    this.description=data.Description;
    this.sprite=new PIXI.Sprite(PIXI.Texture.fromFrame(data.Texture));
    this.sprite.x=data.Position[0];
    this.sprite.y=data.Position[1];
    this.sprite.anchor.set(data.Anchor);
    this.sprite.scale.x=data.Size;
    this.sprite.scale.y=data.Size;
    //this.sprite.anchor.set(0.5,1);
    this.sprite.parentLayer = game.layer;
    if(data.Interactive){
      this.sprite.interactive=data.Interactive;
      this.sprite.buttonMode=true;
      if(data.Door){
        this.sprite.newScene=data.Door;
        this.sprite.on('pointerup', Goto);
      }
      if(data.Menu){
        this.sprite.on('pointerup', function(event){
          if(!game.player.lock){
          //  game.selectedObject=game.objects[index];
            game.selectedObject=index;
            game.player.move(event);
          }
        });
      }
    }
  }
};

function Goto(){
  game.goScene(this.newScene);
}
