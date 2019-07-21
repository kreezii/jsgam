## Objects

##### Example

```json
{
  "Objects":
  [
    {
      "Name":"AccessCard",
      "Texture":"accesscard.png",
      "Description":["It's an access card, It can open closed doors.",
                     "Es una tarjeta de acceso, puede abrir puertas cerradas."],
      "Position":[600,500],
      "Size":0.3,
      "Take":true,
      "Combine":{
        "With":"Door-bedroom-hall",
        "Puzzle":"Bedroom-OpenDoor"
      }
    },
    {
      "Name":"Rope",
      "Texture":"rope.png",
      "Description":["I wonder why this old thing is here.",
                     "Me pregunto qué hará esta cosa vieja aquí."],

      "Position":[400,580],
      "Size":0.7,
      "Take":true
    }
  ]
}
```
### The Objects Schema

`Objects`

- is **required**
- type: `object[]`
- defined in this schema

### Objects Type

Array type: `object[]`

All items must be of the type: `object` with following properties:

| Property      | Type    | Required     | Default | Notes |
| ------------- | ------- | ------------ | ------- ||
| `Combine`     | object  | **Optional** |         ||
| `Description` | array   | **Optional** |         ||
| `Interactive` | boolean | **Optional** | `false` ||
| `Layer`       | string  | **Required** | `""`    ||
| `Lock`        | boolean | **Optional** | `false` ||
| `Mirror`      | boolean | **Optional** | `false` ||
| `Name`        | string  | **Required** | `""`    ||
| `Position`    | array   | **Required** |         ||
| `Size`        | number  | **Optional** | `0`     ||
| `Take`        | boolean | **Optional** | `false` ||
| `Use`         | string  | **Optional** | `""`    ||
| `Area`        | array  | **Required** | `""`    | Not compatible with Texture or Animation |
| `Texture`     | string  | **Required** | `""`    | Not compatible with Area or Animation|
| `Animation`   | object  | **Required** | `""`    | Not compatible with Texture or Area|


#### Combine

##### The Combine Schema

`Combine`

- is **required**
- type: `object`

##### Combine Type

`object` with following properties:

| Property | Type   | Required     | Default |
| -------- | ------ | ------------ | ------- |
| `Puzzle` | string | **Required** | `""`    |
| `With`   | string | **Required** | `""`    |

#### Puzzle

##### The Puzzle Schema

`Puzzle`

- is **required**
- type: `string`
- default: `""`

##### Puzzle Type

`string`

##### Puzzle Example

```json
Bedroom - OpenDoor
```

#### With

##### The With Schema

`With`

- is **required**
- type: `string`
- default: `""`

##### With Type

`string`

##### With Example

```json
Door - bedroom - hall
```

#### Description

##### The Description Schema

`Description`

- is **required**
- type: `string[]`

##### Description Type

Array type: `string[]`

All items must be of the type: `string`

#### Interactive

##### The Interactive Schema

`Interactive`

- is **required**
- type: `boolean`
- default: `false`

##### Interactive Type

`boolean`

##### Interactive Example

```json
false
```

#### Layer

##### The Layer Schema

`Layer`

- is **required**
- type: `string`
- default: `""`

##### Layer Type

`string`

##### Layer Example

```json
Bottom
```

#### Lock

##### The Lock Schema

`Lock`

- is **required**
- type: `boolean`
- default: `false`

##### Lock Type

`boolean`

##### Lock Example

```json
true
```

#### Mirror

##### The Mirror Schema

`Mirror`

- is **required**
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
AccessCard
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

- is **required**
- type: `number`
- default: `0`

##### Size Type

`number`

##### Size Example

```json
0.3
```

#### Take

##### The Take Schema

`Take`

- is **required**
- type: `boolean`
- default: `false`

##### Take Type

`boolean`

##### Take Example

```json
true
```
#### Use

##### The Use Schema

`Use`

- is **required**
- type: `string`
- default: `""`

##### Use Type

`string`

##### Use Example

```json
MoveMachine
```
#### Area

##### The Area Schema

`Area`

- is **required**
- type: `string[]`

##### Area Type

`string`

##### Area Example

```json
[57,58,190,26,247,48,216,90,80,128]
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
accesscard.png
```
#### Animation

##### The Animation Schema

`Animation`

- is **required**
- type: `object`

##### Combine Type

`object` with following properties:

| Property | Type   | Required     | Default |
| -------- | ------ | ------------ | ------- |
| `Name` | string | **Required** | `""`    |
| `Speed`   | number | **Required** | `""`    |

##### Animation Example

```json
"Animation":{
  "Name":"Myjsonfilename",
  "Speed":1

}
```
