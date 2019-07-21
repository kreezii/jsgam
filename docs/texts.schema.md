# The Root Schema Schema

```

```

| Abstract            | Extensible | Status       | Identifiable | Custom Properties | Additional Properties | Defined In                             |
| ------------------- | ---------- | ------------ | ------------ | ----------------- | --------------------- | -------------------------------------- |
| Can be instantiated | Yes        | Experimental | No           | Forbidden         | Permitted             | [texts.schema.json](texts.schema.json) |

# The Root Schema Properties

| Property        | Type     | Required     | Nullable | Defined by                                 |
| --------------- | -------- | ------------ | -------- | ------------------------------------------ |
| [Texts](#texts) | `object` | **Required** | No       | The Root Schema (this schema)              |
| `*`             | any      | Additional   | Yes      | this schema _allows_ additional properties |

## Texts

### The Texts Schema

`Texts`

- is **required**
- type: `object`
- defined in this schema

### Texts Type

`object` with following properties:

| Property        | Type  | Required     |
| --------------- | ----- | ------------ |
| `Back`          | array | **Required** |
| `Continue`      | array | **Required** |
| `Credits`       | array | **Required** |
| `Finished`      | array | **Required** |
| `Help`          | array | **Required** |
| `NewGame`       | array | **Required** |
| `No`            | array | **Required** |
| `NoDescription` | array | **Required** |
| `NotUsable`     | array | **Required** |
| `Options`       | array | **Required** |
| `Warning`       | array | **Required** |
| `Yes`           | array | **Required** |

#### Back

##### The Back Schema

`Back`

- is **required**
- type: `string[]`

##### Back Type

Array type: `string[]`

All items must be of the type: `string`

#### Continue

##### The Continue Schema

`Continue`

- is **required**
- type: `string[]`

##### Continue Type

Array type: `string[]`

All items must be of the type: `string`

#### Credits

##### The Credits Schema

`Credits`

- is **required**
- type: `string[]`

##### Credits Type

Array type: `string[]`

All items must be of the type: `string`

#### Finished

##### The Finished Schema

`Finished`

- is **required**
- type: `string[]`

##### Finished Type

Array type: `string[]`

All items must be of the type: `string`

#### Help

##### The Help Schema

`Help`

- is **required**
- type: `string[]`

##### Help Type

Array type: `string[]`

All items must be of the type: `string`

#### NewGame

##### The Newgame Schema

`NewGame`

- is **required**
- type: `string[]`

##### NewGame Type

Array type: `string[]`

All items must be of the type: `string`

#### No

##### The No Schema

`No`

- is **required**
- type: `string[]`

##### No Type

Array type: `string[]`

All items must be of the type: `string`

#### NoDescription

##### The Nodescription Schema

`NoDescription`

- is **required**
- type: `string[]`

##### NoDescription Type

Array type: `string[]`

All items must be of the type: `string`

#### NotUsable

##### The Notusable Schema

`NotUsable`

- is **required**
- type: `string[]`

##### NotUsable Type

Array type: `string[]`

All items must be of the type: `string`

#### Options

##### The Options Schema

`Options`

- is **required**
- type: `string[]`

##### Options Type

Array type: `string[]`

All items must be of the type: `string`

#### Warning

##### The Warning Schema

`Warning`

- is **required**
- type: `string[]`

##### Warning Type

Array type: `string[]`

All items must be of the type: `string`

#### Yes

##### The Yes Schema

`Yes`

- is **required**
- type: `string[]`

##### Yes Type

Array type: `string[]`

All items must be of the type: `string`
