# Backgrounds

It's recommended to use atlas images for your game but It's possible to add backgorunds as separated images with a given name.

## Example

```json
{
  "Backgrounds":[
    {
      "Name":"Title",
      "Src":"sources/backgrounds/title.png"
    },
    {
      "Name":"Bedroom",
      "Src":"sources/backgrounds/bedroom.png"
    }
  ]
}

````

### The Backgrounds Schema

`Backgrounds`

* is **optional**
* type: `object[]`
* defined in this schema

### Backgrounds Type


Array type: `object[]`

All items must be of the type:
`object` with following properties:


| Property | Type | Required | Default |
|----------|------|----------|---------|
| `Name`| string | **Required** | `""` |
| `Src`| string | **Required** | `""` |



#### Name
##### The Name Schema


`Name`

* is **required**
* type: `string`
* default: `""`


##### Name Type


`string`



All instances must conform to this regular expression
```regex
^(.*)$
```

* test example: [IntroVid](https://regexr.com/?expression=%5E(.*)%24&text=IntroVid)




##### Name Example

```json
IntroVid
```




#### Src
##### The Src Schema


`Src`

* is **required**
* type: `string`
* default: `""`


##### Src Type


`string`



All instances must conform to this regular expression
```regex
^(.*)$
```

* test example: [sources/vids/intro-vid.mp4](https://regexr.com/?expression=%5E(.*)%24&text=sources%2Fvids%2Fintro-vid.mp4)




##### Src Example

```json
sources/vids/intro-vid.mp4
```
