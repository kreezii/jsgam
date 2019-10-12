class ProgressBar{
  constructor(game){
    this.container=new PIXI.Container();
    this.bar=new PIXI.Graphics();
    this.bar.lineStyle(2, 0xFFFFFF, 1);
    this.bar.drawRect(0, 0, game.width/2, 50);


    this.fillbar=new PIXI.Graphics();
    this.bar.lineStyle(0);
    this.fillbar.beginFill(0xFFFFFF);
    this.fillbar.drawRect(0, 0, game.width/2, 50);
    this.fillbar.endFill();
    this.fillbar.width=0;

    this.game=game;
    this.container.addChild(this.fillbar);
    this.container.addChild(this.bar);

  }

  update(progress){
    this.fillbar.width=(this.game.width/200)*progress;
  }
}

export default ProgressBar;
