# The Root Schema Schema

```

```

| Abstract            | Extensible | Status       | Identifiable | Custom Properties | Additional Properties | Defined In                               |
| ------------------- | ---------- | ------------ | ------------ | ----------------- | --------------------- | ---------------------------------------- |
| Can be instantiated | Yes        | Experimental | No           | Forbidden         | Permitted             | [scenes.schema.json](scenes.schema.json) |

# The Root Schema Properties

| Property          | Type       | Required     | Nullable | Defined by                                 |
| ----------------- | ---------- | ------------ | -------- | ------------------------------------------ |
| [Scenes](#scenes) | `object[]` | **Required** | No       | The Root Schema (this schema)              |
| `*`               | any        | Additional   | Yes      | this schema _allows_ additional properties |

## Scenes

### The Scenes Schema

`Scenes`

- is **required**
- type: `object[]`
- defined in this schema

### Scenes Type

Array type: `object[]`

All items must be of the type: `object` with following properties:

| Property     | Type    | Required     | Default |
| ------------ | ------- | ------------ | ------- |
| `Background` | string  | **Required** | `""`    |
| `CutScene`   | string  | **Required** | `""`    |
| `Depth`      | integer | **Required** | `0`     |
| `Foreground` | string  | **Required** | `""`    |
| `Music`      | string  | **Required** | `""`    |
| `Name`       | string  | **Required** | `""`    |
| `Objects`    | array   | **Required** |         |
| `Obstacles`  | object  | **Required** |         |
| `Player`     | object  | **Required** |         |
| `WalkArea`   | array   | **Required** |         |

#### Background

##### The Background Schema

`Background`

- is **required**
- type: `string`
- default: `""`

##### Background Type

`string`

##### Background Example

```json
bedroombg.png
```

#### CutScene

##### The Cutscene Schema

`CutScene`

- is **required**
- type: `string`
- default: `""`

##### CutScene Type

`string`

##### CutScene Example

```json
Intro
```

#### Depth

##### The Depth Schema

`Depth`

- is **required**
- type: `integer`
- default: `0`

##### Depth Type

`integer`

##### Depth Example

```json
1
```

#### Foreground

##### The Foreground Schema

`Foreground`

- is **required**
- type: `string`
- default: `""`

##### Foreground Type

`string`

##### Foreground Example

```json
foreground.png
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
Beginning
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
Bedroom
```

#### Objects

##### The Objects Schema

`Objects`

- is **required**
- type: `string[]`

##### Objects Type

Array type: `string[]`

All items must be of the type: `string`

#### Obstacles

##### The Obstacles Schema

`Obstacles`

- is **required**
- type: `object`

##### Obstacles Type

`object` with following properties:

| Property | Type  | Required     |
| -------- | ----- | ------------ |
| `Table`  | array | **Required** |

#### Table

##### The Table Schema

`Table`

- is **required**
- type: `integer[]`

##### Table Type

Array type: `integer[]`

All items must be of the type: `integer`

#### Player

##### The Player Schema

`Player`

- is **required**
- type: `object`

##### Player Type

`object` with following properties:

| Property | Type   | Required     | Default |
| -------- | ------ | ------------ | ------- |
| `Size`   | number | **Required** | `0`     |

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
1.5
```

#### WalkArea

##### The Walkarea Schema

`WalkArea`

- is **required**
- type: `integer[]`

##### WalkArea Type

Array type: `integer[]`

All items must be of the type: `integer`
