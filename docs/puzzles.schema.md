## Puzzles

### The Puzzles Schema

`Puzzles`

- is **required**
- type: `object[]`
- defined in this schema

### Puzzles Type

At least one property besides the `Name` is **required**

Array type: `object[]`

All items must be of the type: `object` with following properties:

| Property       | Type   | Required     | Default |
| -------------- | ------ | ------------ | ------- |
| `AddObject`    | object | **Optional** |         |
| `CutScene`     | string | **Optional** | `""`    |
| `EndGame`      | object | **Optional** |         |
| `ModifyObject` | object | **Optional** |         |
| `NPCSay`       | object | **Optional** |         |
| `Name`         | string | **Required** | `""`    |
| `Objects`      | array  | **Optional** |         |
| `RemoveObject` | string | **Optional** | `""`    |
| `Resolve`      | string | **Optional** | `""`    |
| `Say`          | array  | **Optional** |         |
| `SetDialogue`  | object | **Optional** |         |

#### AddObject

##### The Addobject Schema

`AddObject`

- is **required**
- type: `object`

##### AddObject Type

`object` with following properties:

| Property | Type   | Required     | Default |
| -------- | ------ | ------------ | ------- |
| `Name`   | string | **Required** | `""`    |
| `Scene`  | string | **Required** | `""`    |

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
Door - hall - techRoom
```

#### Scene

##### The Scene Schema

`Scene`

- is **required**
- type: `string`
- default: `""`

##### Scene Type

`string`

##### Scene Example

```json
Hall
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
TakingControls
```

#### EndGame

##### The Endgame Schema

`EndGame`

- is **required**
- type: `object`

##### EndGame Type

`object` with following properties:

| Property   | Type   | Required     | Default |
| ---------- | ------ | ------------ | ------- |
| `CutScene` | string | **Required** | `""`    |

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
Ending
```

#### ModifyObject

##### The Modifyobject Schema

`ModifyObject`

- is **required**
- type: `object`

##### ModifyObject Type

`object` with following properties:

| Property      | Type   | Required     | Default |
| ------------- | ------ | ------------ | ------- |
| `Description` | array  | **Required** |         |
| `Door`        | object | **Required** |         |
| `Name`        | string | **Required** | `""`    |

#### Description

##### The Description Schema

`Description`

- is **required**
- type: `string[]`

##### Description Type

Array type: `string[]`

All items must be of the type: `string`

#### Door

##### The Door Schema

`Door`

- is **required**
- type: `object`

##### Door Type

`object` with following properties:

| Property | Type   | Required     | Default |
| -------- | ------ | ------------ | ------- |
| `Player` | array  | **Required** |         |
| `To`     | string | **Required** | `""`    |

#### Player

##### The Player Schema

`Player`

- is **required**
- type: `integer[]`

##### Player Type

Array type: `integer[]`

All items must be of the type: `integer`

#### To

##### The To Schema

`To`

- is **required**
- type: `string`
- default: `""`

##### To Type

`string`

##### To Example

```json
Hall
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
Door - bedroom - hall
```

#### NPCSay

##### The Npcsay Schema

`NPCSay`

- is **required**
- type: `object`

##### NPCSay Type

`object` with following properties:

| Property | Type   | Required     | Default |
| -------- | ------ | ------------ | ------- |
| `Name`   | string | **Required** | `""`    |
| `Text`   | array  | **Required** |         |

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
BigRobot
```

#### Text

##### The Text Schema

`Text`

- is **required**
- type: `string[]`

##### Text Type

Array type: `string[]`

All items must be of the type: `string`

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
Bedroom - OpenDoor
```

#### Objects

##### The Objects Schema

`Objects`

- is **required**
- type: `string[]`

##### Objects Type

Array type: `string[]`

All items must be of the type: `string`

#### RemoveObject

##### The Removeobject Schema

`RemoveObject`

- is **required**
- type: `string`
- default: `""`

##### RemoveObject Type

`string`

##### RemoveObject Example

```json
AccessCard
```

#### Resolve

##### The Resolve Schema

`Resolve`

- is **required**
- type: `string`
- default: `""`

##### Resolve Type

`string`

##### Resolve Example

```json
ChangeGunCombine
```

#### Say

##### The Say Schema

`Say`

- is **required**
- type: `string[]`

##### Say Type

Array type: `string[]`

All items must be of the type: `string`

#### SetDialogue

##### The Setdialogue Schema

`SetDialogue`

- is **required**
- type: `object`

##### SetDialogue Type

`object` with following properties:

| Property    | Type   | Required     | Default |
| ----------- | ------ | ------------ | ------- |
| `Character` | string | **Required** | `""`    |
| `Dialogue`  | string | **Required** | `""`    |

#### Character

##### The Character Schema

`Character`

- is **required**
- type: `string`
- default: `""`

##### Character Type

`string`

##### Character Example

```json
monster
```

#### Dialogue

##### The Dialogue Schema

`Dialogue`

- is **required**
- type: `string`
- default: `""`

##### Dialogue Type

`string`

##### Dialogue Example

```json
MonsterConversation2
```
