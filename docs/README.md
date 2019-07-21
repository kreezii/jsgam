#### **Warning:**(Documentation isn't complete yet)

# JSGAM
JavaScript Adventure Game Maker.


## Quick start
- Install [node.js](https://nodejs.org)
- Clone or download [jsgam-template](https://github.com/kreezii/jsgam-template)
- Run ```npm install```

## Manual configuration

NPM Install

```
npm i jsgam
```
Example:
```javascript
import Adventure from 'jsgam';

//Basic game configuration
var config={
  width:1280,
  height:720,
  //autoResize:false
  //parent:'layerInMyWebpage';
  files:[
    'sources/settings.json',
    'sources/texts.json',
    'sources/sounds.json',
    'sources/vids.json',
    'sources/scenes.json',
    'sources/finalscene.json',
    'sources/cutscenes.json',
    'sources/objects.json',
    'sources/objects2.json',
    'sources/doors.json',
    'sources/puzzles.json',
    'sources/credits.json',
    'sources/player.json',
    'sources/characters.json',
    'sources/dialogues.json',
    'sources/atlas/backgrounds.json',
    'sources/atlas/foregrounds.json',
    'sources/atlas/atlas.json',
    'sources/fonts/fuente.fnt',
    'sources/fonts/fuentecolor.fnt',
    'sources/atlas/intro-cutscene.json',
    'sources/atlas/cutscenes-atlas.json',
    'sources/logos/jsgamLogo.png'
  ]
};

new Adventure(config);
```
