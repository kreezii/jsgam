## Cutscenes

##### Example

```json
{
  "Cutscenes":[
  {
  "Name":"Intro",
  "Sequence":[
      {
        "Image":"cutscene-intro0.png",
        "Text":[
          "Description of the first scene.",
          "Descripción de la primera escena"],
        "Time":5,
        "Music":"IntroSnd"
      },
      {
        "Image":"cutscene-intro1.png",
        "Text":[
          "Description of the next scene",
          "Descripción de la siguiente escena"],
        "Time":5
      }
    ]
  },
  {
    "Name":"EndingScene",
    "Video":"EndingVideo"
  }
]
}
```
### The Cutscenes Schema

`Cutscenes`

- is **required**
- type: `object[]`
- defined in this schema

### Cutscenes Type

Array type: `object[]`

All items must be of the type: `object` with following properties:

| Property   | Type   | Required     | Default |
| ---------- | ------ | ------------ | ------- |
| `Name`     | string | **Required** | `""`    |
| `Sequence` | array  | **Required** |         |
| `Video`    | string | **Required** | `""`    |

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
Intro
```

#### Sequence

##### The Sequence Schema

`Sequence`

- is **required**
- type: `object[]`

##### Sequence Type

Array type: `object[]`

All items must be of the type: `object` with following properties:

| Property | Type    | Required     | Default |
| -------- | ------- | ------------ | ------- |
| `Image`  | string  | **Required** | `""`    |
| `Music`  | string  | **Required** | `""`    |
| `Text`   | array   | **Required** |         |
| `Time`   | integer | **Required** | `0`     |

#### Image

##### The Image Schema

`Image`

- is **required**
- type: `string`
- default: `""`

##### Image Type

`string`

##### Image Example

```json
cutscene - intro0.png
```

#### Music

##### The Music Schema

`Music`

- is **required**
- type: `string`
- default: `""`

##### Music Type

`string`

##### Music Example

```json
IntroSnd
```

#### Text

##### The Text Schema

`Text`

- is **required**
- type: `string[]`

##### Text Type

Array type: `string[]`

All items must be of the type: `string`

#### Time

##### The Time Schema

`Time`

- is **required**
- type: `integer`
- default: `0`

##### Time Type

`integer`

##### Time Example

```json
5
```

#### Video

##### The Video Schema

`Video`

- is **required**
- type: `string`
- default: `""`

##### Video Type

`string`

##### Video Example

```json
IntroVid
```
