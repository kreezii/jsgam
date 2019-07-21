# The Root Schema Schema

```
http://example.com/root.json
```

| Abstract            | Extensible | Status       | Identifiable | Custom Properties | Additional Properties | Defined In                                   |
| ------------------- | ---------- | ------------ | ------------ | ----------------- | --------------------- | -------------------------------------------- |
| Can be instantiated | Yes        | Experimental | No           | Forbidden         | Permitted             | [settings.schema.json](settings.schema.json) |

# The Root Schema Properties

| Property              | Type     | Required     | Nullable | Defined by                                 |
| --------------------- | -------- | ------------ | -------- | ------------------------------------------ |
| [Settings](#settings) | `object` | **Required** | No       | The Root Schema (this schema)              |
| `*`                   | any      | Additional   | Yes      | this schema _allows_ additional properties |

## Settings

### The Settings Schema

`Settings`

- is **required**
- type: `object`
- defined in this schema

### Settings Type

`object` with following properties:

| Property      | Type   | Required     | Default |
| ------------- | ------ | ------------ | ------- |
| `FirstScene`  | string | **Required** | `""`    |
| `Help`        | array  | **Required** |         |
| `HoldTime`    | number | **Required** | `0`     |
| `Inventory`   | object | **Required** |         |
| `Languages`   | array  | **Required** |         |
| `Text`        | object | **Required** |         |
| `TitleScreen` | object | **Required** |         |

#### FirstScene

##### The Firstscene Schema

`FirstScene`

- is **required**
- type: `string`
- default: `""`

##### FirstScene Type

`string`

##### FirstScene Example

```json
Bedroom
```

#### Help

##### The Help Schema

`Help`

- is **required**
- type: `string[]`

##### Help Type

Array type: `string[]`

All items must be of the type: `string`

#### HoldTime

##### The Holdtime Schema

`HoldTime`

- is **required**
- type: `number`
- default: `0`

##### HoldTime Type

`number`

##### HoldTime Example

```json
0.1
```

#### Inventory

##### The Inventory Schema

`Inventory`

- is **required**
- type: `object`

##### Inventory Type

`object` with following properties:

| Property     | Type   | Required     | Default |
| ------------ | ------ | ------------ | ------- |
| `Background` | string | **Required** | `""`    |
| `Icon`       | string | **Required** | `""`    |
| `Position`   | string | **Required** | `""`    |

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
inventory - bg.png
```

#### Icon

##### The Icon Schema

`Icon`

- is **required**
- type: `string`
- default: `""`

##### Icon Type

`string`

##### Icon Example

```json
inventoryIcon.png
```

#### Position

##### The Position Schema

`Position`

- is **required**
- type: `string`
- default: `""`

##### Position Type

`string`

##### Position Example

```json
top - right
```

#### Languages

##### The Languages Schema

`Languages`

- is **required**
- type: `string[]`

##### Languages Type

Array type: `string[]`

All items must be of the type: `string`

#### Text

##### The Text Schema

`Text`

- is **required**
- type: `object`

##### Text Type

`object` with following properties:

| Property      | Type   | Required     | Default |
| ------------- | ------ | ------------ | ------- |
| `ButtonStyle` | object | **Required** |         |
| `Position`    | string | **Required** | `""`    |
| `Size`        | string | **Required** | `""`    |
| `Style`       | object | **Required** |         |

#### ButtonStyle

##### The Buttonstyle Schema

`ButtonStyle`

- is **required**
- type: `object`

##### ButtonStyle Type

`object` with following properties:

| Property | Type   | Required     | Default |
| -------- | ------ | ------------ | ------- |
| `align`  | string | **Required** | `""`    |
| `font`   | string | **Required** | `""`    |

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
80px fuente
```

#### Position

##### The Position Schema

`Position`

- is **required**
- type: `string`
- default: `""`

##### Position Type

`string`

##### Position Example

```json
bottom
```

#### Size

##### The Size Schema

`Size`

- is **required**
- type: `string`
- default: `""`

##### Size Type

`string`

##### Size Example

```json
fourth
```

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

#### TitleScreen

##### The Titlescreen Schema

`TitleScreen`

- is **required**
- type: `object`

##### TitleScreen Type

`object` with following properties:

| Property     | Type   | Required     | Default |
| ------------ | ------ | ------------ | ------- |
| `Background` | string | **Required** | `""`    |
| `Music`      | string | **Required** | `""`    |

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
titlebg.png
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
Title
```
