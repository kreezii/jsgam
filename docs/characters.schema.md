## Characters

Array with the non-playable characters configurations.

##### Example

```json
{
  "Characters":[
    {
      "Name":"Character One",
      "Description":[
        "A character inside the adventure",
        "Un personaje dentro de la aventura"
      ],
      "Avatar":"avi1-charas.png",
      "Texture":"sources/npc/char1_tex.png",
      "Json":"sources/npc/char1_tex.json",
      "Skeleton":"sources/npc/char1_ske.json",
      "Armature":"CharOne",
      "Animations":{
        "Stand":"stand",
        "Say":"speak"
      },
      "Size":0.5,
      "Position":[850,600],
      "Color":"0xEA2E18",
      "Dialogue":"CharacterOneDialogue"
    },
    {
      "Name":"Character Two",
      "Description":[
        "Another character",
        "Otro personaje"],
      "Avatar":"seat.png",
      "Texture":"sources/npc/char1_tex.png",
      "Json":"sources/npc/char1_tex.json",
      "Skeleton":"sources/npc/char1_ske.json",
      "Armature":"CharTwo",
      "Size":0.3,
      "Mirror":true,
      "Position":[550,500],
      "Font":"customFont",
      "Dialogue":"AnotherDialogue"
    }
]
}
```
### The Characters Schema

`Characters`

- is **required**
- type: `object[]`
- defined in this schema

### Characters Type

Array type: `object[]`

All items must be of the type: `object` with following properties:

| Property      | Type    | Required     | Default |
| ------------- | ------- | ------------ | ------- |
| `Armature`    | string  | **Required** | `""`    |
| `Animations`  | object  | **Optional** |         |
| `Avatar`      | string  | **Optional** | `""`    |
| `Color`       | string  | **Optional** | `""`    |
| `Description` | array   | **Required** |         |
| `Dialogue`    | string  | **Optional** | `""`    |
| `Font`        | string  | **Optional** | `""`    |
| `Json`        | string  | **Required** | `""`    |
| `Mirror`      | boolean | **Optional** | `false` |
| `Name`        | string  | **Required** | `""`    |
| `Position`    | array   | **Required** |         |
| `Size`        | number  | **Optional** | `1`     |
| `Skeleton`    | string  | **Required** | `""`    |
| `Texture`     | string  | **Required** | `""`    |

#### Armature

##### The Armature Schema

`Armature`

- is **required**
- type: `string`
- default: `""`

##### Armature Type

`string`

##### Armature Example

```json
monster
```

#### Animations

##### The Animations Schema

`Animations`

- is **optinal**
- type: `object`

##### Animations Type

`object` with following properties:

| Property | Type   | Required     | Default |
| -------- | ------ | ------------ | ------- |
| `Say`    | string | **Required** | `""`    |
| `Stand`  | string | **Required** | `""`    |
| `Walk`   | string | **Required** | `""`    |

#### Say

##### The Say Schema

`Say`

- is **required**
- type: `string`
- default: `""`

##### Say Type

`string`

##### Say Example

```json
speak
```

#### Stand

##### The Stand Schema

`Stand`

- is **required**
- type: `string`
- default: `""`

##### Stand Type

`string`

##### Stand Example

```json
stand
```

#### Walk

##### The Walk Schema

`Walk`

- is **required**
- type: `string`
- default: `""`

##### Walk Type

`string`

##### Walk Example

```json
walk
```
#### Avatar

##### The Avatar Schema

`Avatar`

- is **required**
- type: `string`
- default: `""`

##### Avatar Type

`string`

##### Avatar Example

```json
seat.png
```

#### Color

##### The Color Schema

`Color`

- is **optional**
- is **required** if Dialogue property is used
- type: `string`
- default: `""`

##### Color Type

`string`

##### Color Example

```json
0xea2e18
```

#### Description

##### The Description Schema

`Description`

- is **required**
- type: `string[]`

##### Description Type

Array type: `string[]`

All items must be of the type: `string`

#### Dialogue

##### The Dialogue Schema

`Dialogue`

- is **optional**
- type: `string`
- default: `""`

##### Dialogue Type

`string`

##### Dialogue Example

```json
MonsterConversation
```

#### Font

##### The Font Schema

`Font`

- is **optional**
- is **required** if Dialogue property is used
- type: `string`
- default: `""`

##### Font Type

`string`

##### Font Example

```json
fuentecolor
```

#### Mirror

##### The Mirror Schema

`Mirror`

- is **optional**
- type: `boolean`
- default: `false`

##### Mirror Type

`boolean`

##### Mirror Example

```json
true
```

#### Name

##### The Name Schema

`Name`

- is **required**
- type: `string`
- default: `""`

##### Name Type

`string`

##### Name Example

```json
monster
```

#### Position

##### The Position Schema

`Position`

- is **required**
- type: `integer[]`

##### Position Type

Array type: `integer[]`

All items must be of the type: `integer`

#### Size

##### The Size Schema

`Size`

- is **optional**
- type: `number`
- default: `0`

##### Size Type

`number`

##### Size Example

```json
0.3
```
#### Json

##### The Json Schema

`Json`

- is **required**
- type: `string`
- default: `""`

##### Json Type

`string`

##### Json Example

```json
"sources / npc / monster_tex.json"
```

#### Skeleton

##### The Skeleton Schema

`Skeleton`

- is **required**
- type: `string`
- default: `""`

##### Skeleton Type

`string`

##### Skeleton Example

```json
"sources / npc / monster_ske.json"
```

#### Texture

##### The Texture Schema

`Texture`

- is **required**
- type: `string`
- default: `""`

##### Texture Type

`string`

##### Texture Example

```json
"sources / npc / monster_tex.png"
```
