This document shows examples for Texture JATS usage. The premise of TextureJATS is to have exactly one tagging style per use-case. E.g. there is only one way to tag a reference, author or affiliation. Additionally we define a set of optional extensions to model reproducible elements (cells) in JATS. This work is inspired but not related to JATS4R, a similar effort to make JATS more reusable.

## Affiliations

`<aff>` records are used to encode affiliations of authors and editors, as well as present addresses.

```xml
<aff id="aff1">
  <institution content-type="orgname">Example Organisation</institution>
  <institution content-type="orgdiv1">Division Level 1</institution>
  <institution content-type="orgdiv2">Division Level 2</institution>
  <institution content-type="orgdiv3">Neurobiology Laboratory</institution>
  <city>Göttingen</city>
  <country>Germany</country>
</aff>
```
