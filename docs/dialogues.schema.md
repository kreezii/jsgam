## Dialogues

##### Example

```json
{
  "Dialogues":[
  {
    "Name":"Conversation",
    "DefaultBranch":"Meet",
    "Branches":[
      {
      "Name":"Meet",
      "Choices":[
        {
          "Text":[
            "Hi",
            "Hola"
          ],
          "Answer":[
            "Hey there!",
            "¿Qué tal?"
          ],
          "Repeat":false
        },
        {
          "Text":[
            "How are you?",
            "¿Cómo estás?"
          ],
          "Answer":[
            "Fine, thank you",
            "Bien, gracias"
          ],
          "Link":"Farewell"
        }
      ]
    },
    {
      "Name":"Farewell",
      "Choices":[
        {
          "Text":["Bye",
            "Adiós"],
          "Answer":["See you soon",
            "Hasta pronto"
          ],
          "Puzzle":"ChangeDialogue",
          "EndDialogue":true
        }
      ]
    }
    ]
  }
  ]
}
```

### The Dialogues Schema

`Dialogues`

- is **required**
- type: `object[]`
- defined in this schema

### Dialogues Type

Array type: `object[]`

All items must be of the type: `object` with following properties:

| Property        | Type   | Required     | Default |
| --------------- | ------ | ------------ | ------- |
| `Branches`      | array  | **Required** |         |
| `DefaultBranch` | string | **Required** | `""`    |
| `Name`          | string | **Required** | `""`    |

#### Branches

##### The Branches Schema

`Branches`

- is **required**
- type: `object[]`

##### Branches Type

Array type: `object[]`

All items must be of the type: `object` with following properties:

| Property  | Type   | Required     | Default |
| --------- | ------ | ------------ | ------- |
| `Choices` | array  | **Required** |         |
| `Name`    | string | **Required** | `""`    |

#### Choices

##### The Choices Schema

`Choices`

- is **required**
- type: `object[]`

##### Choices Type

Array type: `object[]`

All items must be of the type: `object` with following properties:

| Property      | Type    | Required     | Default |
| ------------- | ------- | ------------ | ------- |
| `Answer`      | array   | **Required** |         |
| `EndDialogue` | boolean | **Optional** | `false` |
| `Link`        | string  | **Optional** | `""`    |
| `Puzzle`      | string  | **Optional** | `""`    |
| `Repeat`      | boolean | **Optional** | `false` |
| `Text`        | array   | **Required** |         |

#### Answer

##### The Answer Schema

`Answer`

Text said by the NPC

- is **required**
- type: `string[]`

##### Answer Type

Array type: `string[]`

All items must be of the type: `string`

#### EndDialogue

Finishes the dialogue

##### The Enddialogue Schema

`EndDialogue`

- is **required**
- type: `boolean`
- default: `false`

##### EndDialogue Type

`boolean`

##### EndDialogue Example

```json
true
```

#### Link

Change the choices branch

##### The Link Schema

`Link`

- is **required**
- type: `string`
- default: `""`

##### Link Type

`string`

##### Link Example

```json
Despedida
```

#### Puzzle

Resolves a puzzle

##### The Puzzle Schema

`Puzzle`

- is **required**
- type: `string`
- default: `""`

##### Puzzle Type

`string`

##### Puzzle Example

```json
ChangeDialoguePuzzle
```

#### Repeat

##### The Repeat Schema

`Repeat`

- is **required**
- type: `boolean`
- default: `false`

##### Repeat Type

`boolean`

##### Repeat Example

```json
false
```

#### Text

Text said by the player

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
Meet
```

#### DefaultBranch

##### The Defaultbranch Schema

`DefaultBranch`

- is **required**
- type: `string`
- default: `""`

##### DefaultBranch Type

`string`

##### DefaultBranch Example

```json
Meet
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
MonsterConversation
```
