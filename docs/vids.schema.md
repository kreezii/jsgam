## Vids
Example
```
{
  "Vids":[
    {
      "Name":"IntroVid",
      "Src":"sources/vids/intro-vid.mp4"
    },
    {
      "Name":"AnotherOne",
      "Src":"sources/vids/another-video.mp4"
    }
  ]
}
```

### The Vids Schema

`Vids`

* is **optional**
* type: `object[]`
* defined in this schema

### Vids Type


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


##### Src Example

```json
sources/vids/intro-vid.mp4
```
