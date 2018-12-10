This document shows examples for Texture JATS usage. The premise of TextureJATS is to have exactly one tagging style per use-case. E.g. there is only one way to tag a reference, author or affiliation. Additionally we define a set of optional extensions to model reproducible elements (cells) in JATS. This work is inspired but not related to JATS4R, a similar effort to make JATS more reusable.

## Affiliations

`<aff>` records are used to encode affiliations of authors and editors, as well as present addresses.

Status: Implemented

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

## Figure Groups

```xml
<fig-group>
  <fig id="fig1a">
    <label>Figure 1A</label>
    <caption>
      <title>First panel</title>
      <p>First panel caption</p>
    </caption>
    <graphic mime-subtype="jpeg" mimetype="image" xlink:href="fig1a.jpg" />
  </fig>
  <fig id="fig1b">
    <label>Figure 1B</label>
    <caption>
      <title>Second panel</title>
      <p>Second panel caption</p>
    </caption>
    <graphic mime-subtype="jpeg" mimetype="image" xlink:href="fig1b.jpg" />
  </fig>
</fig-group>

<!-- Use Case 2: 1 Main Figure + 1 Supplement -->
<fig-group>
  <fig id="fig1">
    <label>Figure 1</label>
    <caption id="fig1-caption">
      <title>Main figure title</title>
      <p>Main figure title</p>
    </caption>
    <graphic mime-subtype="jpeg" mimetype="image" xlink:href="fig1.jpg" />
  </fig>
  <fig id="fig1s1" specific-use="supplement">
    <label>Figure 1–figure supplement 1</label>
    <caption id="fig1-caption">
      <title>First figure supplement title</title>
      <p>First figure supplement caption</p>
    </caption>
    <graphic mime-subtype="jpeg" mimetype="image" xlink:href="fig1s1.jpg" />
  </fig>
</fig-group>
```
