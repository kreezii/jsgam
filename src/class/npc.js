import Character from './character.js';

class NPC extends Character{
  build(){
    this.sprite.interactive=true;
    this.sprite.buttonMode=true;
  }
}

export default NPC;
