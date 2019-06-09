## Settings
Example
```
{
  "Settings": {
    "Languages": [
      "English",
      "Español"
    ],
    "Text": {
      "Style": {
        "font":"55px Desyrel",
        "align": "center"
      },
      "ButtonStyle": {
        "font":"80px Desyrel",
        "align": "center"
      },
      "Position":"bottom",
      "Size":"fourth"
    },
    "TitleScreen": {
      "Background": "titlebg.png",
      "Music": "Title"
    },
    "Help":[
      "help-language1.png",
      "help-language2.png"
    ],
    "FirstScene":"MainScene",
    "Inventory": {
      "Position": "top-right",
      "Background": "inventory-bg.png",
      "Icon": "inventory-icon.png"
    }
  }
}
```
### The Settings Schema

`Settings`

* is **required**
* type: `object`
* defined in this schema

### Settings Type


`object` with following properties:


| Property | Type | Required | Default |
|----------|------|----------|---------|
| `FirstScene`| string | **Required** | `undefined` |
| `Help`| array | **Required** | `undefined` |
| `Inventory`| object | **Required** | `undefined` |
| `Languages`| array | **Required** | `undefined` |
| `Text`| object | **Required** | `undefined` |
| `TitleScreen`| object | **Required** | `undefined` |



#### FirstScene
##### The Firstscene Schema


`FirstScene`

* is **required**
* type: `string`
* default: `""`


##### FirstScene Type


`string`


##### FirstScene Example

```json
Entrada
```




#### Help
##### The Help Schema


`Help`

* is **required**
* type: `string[]`


##### Help Type


Array type: `string[]`

All items must be of the type:
`string`


#### Inventory
##### The Inventory Schema


`Inventory`

* is **required**
* type: `object`

##### Inventory Type


`object` with following properties:


| Property | Type | Required | Default |
|----------|------|----------|---------|
| `Background`| string | **Required** | `""` |
| `Icon`| string | **Required** | `""` |
| `Position`| string | **Required** | `""` |



#### Background
##### The Background Schema


`Background`

* is **required**
* type: `string`
* default: `""`


##### Background Type


`string`

##### Background Example

```json
inventory-bg.png
```




#### Icon
##### The Icon Schema


`Icon`

* is **required**
* type: `string`
* default: `""`


##### Icon Type


`string`

##### Icon Example

```json
inventory-icon.png
```




#### Position
##### The Position Schema


`Position`

* is **required**
* type: `string`
* default: `""`


##### Position Type


`string`

##### Position Values

```json
top-right
top-left
bottom-right
bottom-left
```









#### Languages
##### The Languages Schema


`Languages`

* is **required**
* type: `string[]`


##### Languages Type


Array type: `string[]`

All items must be of the type:
`string`


#### Text
##### The Text Schema


`Text`

* is **required**
* type: `object`

##### Text Type


`object` with following properties:


| Property | Type | Required | Default |
|----------|------|----------|---------|
| `ButtonStyle`| object | **Required** |  |
| `Position`| string | **Required** | `""` |
| `Size`| string | **Required** | `""` |
| `Style`| object | **Required** |  |



#### ButtonStyle
##### The Buttonstyle Schema


`ButtonStyle`

* is **required**
* type: `object`

##### ButtonStyle Type


`object` with following properties:


| Property | Type | Required | Default |
|----------|------|----------|---------|
| `align`| string | **Required** | `""` |
| `font`| string | **Required** | `""` |



#### align
##### The Align Schema


`align`

* is **required**
* type: `string`
* default: `""`


##### align Type


`string`


##### align Example

```json
center
```




#### font
##### The Font Schema


`font`

* is **required**
* type: `string`
* default: `""`


##### font Type


`string`



##### font Example

```json
80px Fontname
```









#### Position
##### The Position Schema


`Position`

* is **required**
* type: `string`
* default: `""`


##### Position Type


`string`



##### Position Values

```json
top
bottom
```




#### Size
##### The Size Schema


`Size`

* is **required**
* type: `string`
* default: `""`


##### Size Type


`string`




##### Size Values

```json
half
fourth
```




#### Style
##### The Style Schema


`Style`

* is **required**
* type: `object`

##### Style Type


`object` with following properties:


| Property | Type | Required | Default |
|----------|------|----------|---------|
| `align`| string | **Required** | `""` |
| `font`| string | **Required** | `""` |



#### align
##### The Align Schema


`align`

* is **required**
* type: `string`
* default: `""`


##### align Type


`string`




##### align Example

```json
center
```




#### font
##### The Font Schema


`font`

* is **required**
* type: `string`
* default: `""`


##### font Type


`string`




##### font Example

```json
55px Desyrel
```














#### TitleScreen
##### The Titlescreen Schema


`TitleScreen`

* is **required**
* type: `object`

##### TitleScreen Type


`object` with following properties:


| Property | Type | Required | Default |
|----------|------|----------|---------|
| `Background`| string | **Required** | `""` |
| `Music`| string | **Required** | `""` |



#### Background
##### The Background Schema


`Background`

* is **required**
* type: `string`
* default: `""`


##### Background Type


`string`


##### Background Example

```json
titlebg.png
```




#### Music
##### The Music Schema


`Music`

* is **required**
* type: `string`
* default: `""`


##### Music Type


`string`



##### Music Example

```json
Title
```
