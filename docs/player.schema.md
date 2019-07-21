## Player

##### Example

```json
{
  "Player":
    {
      "Avatar":"monitor.png",
      "Texture":"sources/player/player_tex.png",
      "Json":"sources/player/player_tex.json",
      "Skeleton":"sources/player/player_ske.json",
      "Armature":"Armature",
      "Speed":1,
      "Animations":{
        "Stand":"stand",
        "Walk":"walk",
        "Take":"take",
        "Use":"use",
        "Say":"speak"
      },
      "Position":[500,600],
      "Color":"0xFFFFFF"
    }
}

```
### The Player Schema

`Player`

- is **required**
- type: `object`
- defined in this schema

### Player Type

`object` with following properties:

| Property     | Type    | Required     | Default |
| ------------ | ------- | ------------ | ------- |
| `Animations` | object  | **Optional** |         |
| `Armature`   | string  | **Required** | `""`    |
| `Avatar`     | string  | **Required** | `""`    |
| `Color`      | string  | **Required** | `""`    |
| `Json`       | string  | **Required** | `""`    |
| `Position`   | array   | **Required** |         |
| `Skeleton`   | string  | **Required** | `""`    |
| `Speed`      | integer | **Optional** | `0`     |
| `Texture`    | string  | **Required** | `""`    |

#### Animations

##### The Animations Schema

`Animations`

- is **optional**
- type: `object`

##### Animations Type

`object` with following properties:

| Property | Type   | Required     | Default |
| -------- | ------ | ------------ | ------- |
| `Say`    | string | **Required** | `""`    |
| `Stand`  | string | **Required** | `""`    |
| `Take`   | string | **Required** | `""`    |
| `Use`    | string | **Required** | `""`    |
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

#### Take

##### The Take Schema

`Take`

- is **required**
- type: `string`
- default: `""`

##### Take Type

`string`

##### Take Example

```json
take
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
use
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
Armature
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
monitor.png
```

#### Color

##### The Color Schema

`Color`

- is **required**
- type: `string`
- default: `""`

##### Color Type

`string`

##### Color Example

```json
0xffffff
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
sources / player / player_tex.json
```

#### Position

##### The Position Schema

`Position`

- is **required**
- type: `integer[]`

##### Position Type

Array type: `integer[]`

All items must be of the type: `integer`

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
sources / player / player_ske.json
```

#### Speed
Defines how fast the player walks

##### The Speed Schema

`Speed`

- is **required**
- type: `integer`
- default: `0`

##### Speed Type

`integer`

##### Speed Example

```json
1
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
sources / player / player_tex.png
```
