# JSGAM
Creador de aventuras gráficas en JavaScript (JavaScript Adventure Game Maker).

Instalar a través de NPM

```
npm i jsgam
```
Ejemplo:
```javascript
import Adventure from 'jsgam';

//Variable con la configuración del juego
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
