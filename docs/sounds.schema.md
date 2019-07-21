# The Root Schema Schema

```

```

| Abstract            | Extensible | Status       | Identifiable | Custom Properties | Additional Properties | Defined In                               |
| ------------------- | ---------- | ------------ | ------------ | ----------------- | --------------------- | ---------------------------------------- |
| Can be instantiated | Yes        | Experimental | No           | Forbidden         | Permitted             | [sounds.schema.json](sounds.schema.json) |

# The Root Schema Properties

| Property          | Type       | Required     | Nullable | Defined by                                 |
| ----------------- | ---------- | ------------ | -------- | ------------------------------------------ |
| [Sounds](#sounds) | `object[]` | **Required** | No       | The Root Schema (this schema)              |
| `*`               | any        | Additional   | Yes      | this schema _allows_ additional properties |

## Sounds

### The Sounds Schema

`Sounds`

- is **required**
- type: `object[]`
- defined in this schema

### Sounds Type

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
IntroSnd
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
sources / sounds / Space - Game - Intro.mp3
```
