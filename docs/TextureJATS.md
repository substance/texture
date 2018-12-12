This document shows examples for Texture JATS usage. The premise of TextureJATS is to have exactly one tagging style per use-case. E.g. there is only one way to tag a reference, author or affiliation. Additionally we define a set of optional extensions to model reproducible elements (cells) in JATS. This work is inspired but not related to JATS4R, a similar effort to make JATS more reusable.

## Affiliations

`<aff>` records are used to encode affiliations of authors and editors, as well as present addresses.

Status: Implemented

```xml
<!-- Status: SYNCED -->
<aff id="aff1">
  <institution content-type="orgname">Example Organisation</institution>
  <institution content-type="orgdiv1">Division Level 1</institution>
  <institution content-type="orgdiv2">Division Level 2</institution>
  <institution content-type="orgdiv3">Neurobiology Laboratory</institution>
  <city>Göttingen</city>
  <country>Germany</country>
</aff>
```

## Sub-Figures

Use Case: Multi-panel figure

```xml
<!-- Status: SYNCED -->
<fig-group id="fig3-group">
  <fig id="fig3a">
    <label>Figure 3A</label>
    <caption>
      <title>First panel</title>
      <p>First panel caption</p>
    </caption>
    <graphic id="fig3a-graphic" mime-subtype="jpeg" mimetype="image" xlink:href="fig1a.jpg" />
  </fig>
  <fig id="fig3b">
    <label>Figure 1B</label>
    <caption>
      <title>Second panel</title>
      <p>Second panel caption</p>
    </caption>
    <graphic id="fig3-graphic" mime-subtype="jpeg" mimetype="image" xlink:href="fig1b.jpg" />
  </fig>
</fig-group>
```

Use Case: Main Figure + Figure supplement

```xml
<!-- Status: SYNCED -->
<fig-group id="fig2-group">
  <fig id="fig2">
    <label>Figure 2</label>
    <caption id="fig2-caption">
      <title>Figure with supplement</title>
      <p>Caption of main figure</p>
    </caption>
    <graphic id="fig2-graphic" mime-subtype="jpeg" mimetype="image" xlink:href="fig2.jpg" />
  </fig>
  <fig id="fig2s1" specific-use="supplement">
    <label>Figure 2–figure supplement 1</label>
    <caption id="fig2-caption">
      <title>Figure supplement title</title>
      <p id="fig2-caption-p1">Caption of figure supplement</p>
    </caption>
    <graphic mime-subtype="jpeg" mimetype="image" xlink:href="fig2s1.jpg" />
  </fig>
</fig-group>
```

## Chapters

Chapters are used to model appendices, acknowledgements, author response, decision letter, data availability section.

```xml
<!-- Status: NEEDS_SYNC -->
<sub-article article-type="decision-letter" id="chapter-1">
  <front-stub>
  <title-group>
    <article-title>Decision letter</article-title>
  </title-group>
  <contrib-group>...</contrib-group>
  </front-stub>
  <body>...</body>
</sub-article>
```