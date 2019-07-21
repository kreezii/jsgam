## Credits

##### Example

```json
{
  "Credits":{
    "Music":"CreditsMusic",
    "Background":"CreditsBackground",
    "Time":20,
    "Style":{
      "font":"55px font",
      "align": "center",
      "tint":"0xEA2E18"
    },
    "Lines":[
      {
        "Title":[
          "A Story by",
          "Un Guión de"
        ],
        "Text":["Person 1"]
      },
      {
        "Title":[
          "Music by",
          "Música por"
        ],
        "Text":[
          "Person 1",
          "Person 2"
        ]
      },
      {
        "Title":[
          "Graphics by",
          "Gráficos por"
        ],
        "Text":[
          "Person 1",
          "Person 2",
          "Person 3"
        ]
      }
    ]
  }
}
```
### The Credits Schema

`Credits`

- is **required**
- type: `object`
- defined in this schema

### Credits Type

`object` with following properties:

| Property     | Type    | Required     | Default |
| ------------ | ------- | ------------ | ------- |
| `Background` | string  | **Required** | `""`    |
| `Lines`      | array   | **Required** |         |
| `Music`      | string  | **Optional** | `""`    |
| `Style`      | object  | **Required** |         |
| `Time`       | integer | **Required** | `0`     |

#### Background

##### The Background Schema

`Background`

- is **required**
- type: `string`
- default: `""`

##### Background Type

`string`

#### Lines

##### The Lines Schema

`Lines`

- is **required**
- type: `object[]`

##### Lines Type

Array type: `object[]`

All items must be of the type: `object` with following properties:

| Property | Type  | Required     |
| -------- | ----- | ------------ |
| `Text`   | array | **Required** |
| `Title`  | array | **Required** |

#### Text

##### The Text Schema

`Text`

- is **required**
- type: `string[]`

##### Text Type

Array type: `string[]`

All items must be of the type: `string`

#### Title

##### The Title Schema

`Title`

- is **required**
- type: `string[]`

##### Title Type

Array type: `string[]`

All items must be of the type: `string`

#### Music

##### The Music Schema

`Music`

- is **required**
- type: `string`
- default: `""`

##### Music Type

`string`


#### Style

##### The Style Schema

`Style`

- is **required**
- type: `object`

##### Style Type

`object` with following properties:

| Property | Type   | Required     | Default |
| -------- | ------ | ------------ | ------- |
| `align`  | string | **Required** | `""`    |
| `font`   | string | **Required** | `""`    |
| `tint`   | string | **Required** | `""`    |

#### align

##### The Align Schema

`align`

- is **required**
- type: `string`
- default: `""`

##### align Type

`string`

##### align Example

```json
center
```

#### font

##### The Font Schema

`font`

- is **required**
- type: `string`
- default: `""`

##### font Type

`string`

##### font Example

```json
55px fuente
```

#### tint

##### The Tint Schema

`tint`

- is **required**
- type: `string`
- default: `""`

##### tint Type

`string`

All instances must conform to this regular expression

##### tint Example

```json
0xea2e18
```

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
20
```
