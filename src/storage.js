import localForage from 'localforage';

export default class Storage{
  constructor(game){
    this.game=game;
  }

  //Save adventure progress
  save(){
    //Get solved puzzles
    let puzzlesSolved=[];
    let puzzleArray=Object.values(this.game.puzzles)

    puzzleArray.forEach(function(puzzle){
      if(puzzle.solved && !puzzlesSolved.includes(puzzle.config.Name))
        puzzlesSolved.push(puzzle.config.Name)
    });

    //Get dialogues
    let dialoguesDisabled=[];
    let dialogueArray=Object.values(this.game.dialogues);


    dialogueArray.forEach(function(dialogue){
      let branches=Object.values(dialogue.branches);

      branches.forEach(function(branch){

        branch.Choices.forEach(function(choice,index){
          if(choice.disabled){
            let disabledOption={
              Dialogue:dialogue.config.Name,
              Branch:branch.Name,
              Index:index
            }
            dialoguesDisabled.push(disabledOption);
          }
        });
      });

    });

    //Get player cutscenes
    let cutscenesPlayed=[];
    let cutscenesArray=Object.values(this.game.cutscenes);
    cutscenesArray.forEach(function(cutscene){
      if(cutscene.played) cutscenesPlayed.push(cutscene.config.Name);
    });

    //Store the progress
    this.progress={
      language:this.game.activeLanguage,
      latestScene:this.game.activeScene.config.Name,
      playerPos:[this.game.player.sprite.x,this.game.player.sprite.y],
      inventory:this.game.inventory.objects,
      puzzles:puzzlesSolved,
      dialogues:dialoguesDisabled,
      cutscenes:cutscenesPlayed
    }

    //Save object to local storage
    localForage.setItem('JSGAM_Storage', this.progress);
  }

  //Load adventure progress
  load(){
    let game=this.game;

    //Load objects in inventory
    this.progress.inventory.forEach(function(item){

      //Add object to inventory
      game.inventory.add(item);

      //Remove objects from scenes configurations
      let thisItem=item;
      let sceneArray=Object.values(game.scenes);
      sceneArray.forEach(function(scene){
        if(scene.config.Objects!==undefined && scene.config.Objects.includes(thisItem)){
          let tmpIndex=scene.config.Objects.indexOf(thisItem);
          scene.config.Objects.splice(tmpIndex,1);
        }
      })

    });

    //Disable dialogues finished
    this.progress.dialogues.forEach(function(disable){
      game.dialogues[disable.Dialogue].branches[disable.Branch].Choices[disable.Index].disabled=true;
    });

    //Disable cutscenes played
    this.progress.cutscenes.forEach(function(name){
      game.cutscenes[name].played=true;
    });

    this.game.silentMode=true;
    //Resolve puzzles already done
    this.progress.puzzles.forEach(function(name){
      game.puzzles[name].resolve();
    });
    this.game.silentMode=false

    //Add player to latest Position
    this.game.player.sprite.x=this.progress.playerPos[0];
    this.game.player.sprite.y=this.progress.playerPos[1];

  }

  //Clear local storage
  delete(){
    localForage.clear();
  }

  check(){
    let storage=this;

    localForage.getItem('JSGAM_Storage').then(function(value) {
      // This code runs once the value has been loaded
      // from the offline store.
      if(value!==null){
        storage.progress=value;
        storage.game.activeLanguage=value.language;
        storage.game.scenes["Title"].changeLanguage();
        storage.game.scenes["Title"].states["MainMenu"].enable("Continue");
      }
    }).catch(function(err) {
        // This code runs if there were any errors
        console.log(err);
    });
  }
}
