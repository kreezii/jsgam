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
    'sources/cutscenes.json',
    'sources/objects.json',
    'sources/puzzles.json',
    'sources/credits.json',
    'sources/player.json',
    'sources/characters.json',
    'sources/atlas/backgrounds.json',
    'sources/atlas/atlas.json',
    'sources/atlas/atlas2.json',
    'sources/atlas/intro-cutscene.json'
  ]
};

new Adventure(config);
```
