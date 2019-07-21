# The Root Schema Schema

```

```

| Abstract            | Extensible | Status       | Identifiable | Custom Properties | Additional Properties | Defined In                           |
| ------------------- | ---------- | ------------ | ------------ | ----------------- | --------------------- | ------------------------------------ |
| Can be instantiated | Yes        | Experimental | No           | Forbidden         | Permitted             | [vids.schema.json](vids.schema.json) |

# The Root Schema Properties

| Property      | Type       | Required     | Nullable | Defined by                                 |
| ------------- | ---------- | ------------ | -------- | ------------------------------------------ |
| [Vids](#vids) | `object[]` | **Required** | No       | The Root Schema (this schema)              |
| `*`           | any        | Additional   | Yes      | this schema _allows_ additional properties |

## Vids

### The Vids Schema

`Vids`

- is **required**
- type: `object[]`
- defined in this schema

### Vids Type

Array type: `object[]`

All items must be of the type: `object` with following properties:

| Property | Type   | Required     | Default |
| -------- | ------ | ------------ | ------- |
| `Name`   | string | **Required** | `""`    |
| `Src`    | string | **Required** | `""`    |

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
IntroVid
```

#### Src

##### The Src Schema

`Src`

- is **required**
- type: `string`
- default: `""`

##### Src Type

`string`

##### Src Example

```json
sources / vids / intro - vid.mp4
```
