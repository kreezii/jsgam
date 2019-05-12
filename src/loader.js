

class Loader extends PIXI.loaders.Loader{
  constructor(){
    super();
    this.game=null;
    this.onLoad.add(this.update.bind(this));
    this.onError.add(this.error.bind(this));
  }

  //Add config files to loader
  addJSON(files){
    let i;
    let arrayLength=files.length;

    for(i=0;i<arrayLength;i++){
      let name=files[i].slice(files[i].lastIndexOf("/")+1,files[i].lastIndexOf("."));
      this.add(name,files[i]);
    }
  }

  //Add resource files to loader and settings to game
  addFiles(files){
    let i;
    let length=files.length
    for(i=0;i<length;i++){
      //Add config files to setup the game
      if(files[i].data.Settings) this.game.settings=files[i].data.Settings;
      if(files[i].data.Scenes) this.game.data.scenes=files[i].data.Scenes;
      if(files[i].data.Cutscenes) this.game.data.cutscenes=files[i].data.Cutscenes;
      if(files[i].data.Objects) this.game.data.objects=files[i].data.Objects;
      if(files[i].data.Dialogues) this.game.data.dialogues=files[i].data.Dialogues;
      if(files[i].data.Puzzles) this.game.data.puzzles=files[i].data.Puzzles;
      if(files[i].data.Credits) this.game.data.credits=files[i].data.Credits;
      if(files[i].data.Texts) this.game.data.texts=files[i].data.Texts;

      //Look for sound files
      if(files[i].data.Sounds){
        let soundSrc=files[i].data.Sounds;
        for(let j=0;j<soundSrc.length;j++){
           let tmpSound=soundSrc[j].Src;
           if(tmpSound!==null) this.add(soundSrc[j].Name,tmpSound);
        }
       }

       //Look for video files
       if(files[i].data.Vids)
       {
         //Fix for load correctly vids with pixi-sound
         this.fixVidLoad();
         let vidSrc=files[i].data.Vids;
         for(let i=0;i<vidSrc.length;i++){
           let tmpVid=vidSrc[i].Src;
           if(tmpVid!==null) this.add(vidSrc[i].Name,tmpVid);
         }
       }

       //Load Animations
       if(files[i].data.Animations)
       {
         let animSrc=files[i].data.Animations;
         for(let i=0;i<animSrc.length;i++){
           let tmpAnim=animSrc[i].Src;
           if(tmpAnim!==null) this.add(animSrc[i].Name,tmpAnim);
         }
       }

       //Load Backgrounds if don't use texture atlas for backgrounds
       if(files[i].data.Backgrounds){
         let bgSrc=files[i].data.Animations;
         for(let i=0;i<bgSrc.length;i++){
           let tmpBg=bgSrc[i].Src;
           if(tmpBg!==null) this.add(bgSrc[i].Name,tmpBg);
         }
       }

       //Look for player files
       if(files[i].data.Player){
         this.add('playerTex', files[i].data.Player.Texture)
             .add('playerJson', files[i].data.Player.Json)
             .add('playerSkeleton', files[i].data.Player.Skeleton);
         this.game.data.player=files[i].data.Player;
       }

       //Look for NPC files
       if(files[i].data.Characters){
         let npcSrc=files[i].data.Characters;
         for(let i=0;i<npcSrc.length;i++){
            this.add(npcSrc[i].Name+"Tex", npcSrc[i].Texture)
            .add(npcSrc[i].Name+'Json', npcSrc[i].Json)
            .add(npcSrc[i].Name+'Skeleton', npcSrc[i].Skeleton);
          }
          this.game.data.npc=files[i].data.Characters;
        }
    }
  }

  //Fix for load mp4 as videos instead as audio because of pixi-sound
  fixVidLoad(){
    PIXI.sound.utils.extensions.splice(PIXI.sound.utils.extensions.indexOf('mp4'), 1);
    PIXI.loaders.Resource.setExtensionXhrType('mp4', undefined);
    PIXI.loaders.Resource.setExtensionLoadType('mp4', PIXI.loaders.Resource.LOAD_TYPE.VIDEO);
  }

  //Loading progress
  update(){
    let percent=Math.floor(this.progress);
    this.game.progressBar.width=(this.game.width/100)*percent;
    //this.game.loadingTxt.text="Loading... "+ percent+"%";
  }

  //File failed to load
  error(resource){
    console.log(resource);
  }

}

export default Loader;
