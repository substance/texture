This document shows examples for Texture JATS usage. The premise of TextureJATS is to have exactly one tagging style per use-case. E.g. there is only one way to tag a reference, author or affiliation. Additionally we define a set of optional extensions to model reproducible elements (cells) in JATS. This work is inspired but not related to JATS4R, a similar effort to make JATS more reusable.

## Affiliations

`<aff>` records are used to encode affiliations of authors and editors, as well as present addresses.

```xml
<!-- NEEDS_KITCHEN_SINK_SYNC, NEEDS_SCHEMA_SYNC -->
<!-- removed fax -->
<aff id="aff1">
  <institution content-type="orgname">Example Organisation</institution>
  <institution content-type="orgdiv1">Optional Division Level 1</institution>
  <institution content-type="orgdiv2">Optional Division Level 2</institution>
  <institution content-type="orgdiv3">Optional Division Level 3</institution>
  <addr-line content-type="street-address">Optional Street Address</addr-line>
  <addr-line content-type="complements">Optional Street Complements</addr-line>
  <city>Optional City</city>
  <state>Optional State</state>
  <postal-code>Optional Postal Code</postal-code>
  <country>Country Country</country>
  <phone>Optional Phone</phone>
  <email>Optional Email</email>
  <uri content-type="link">Optional Website</uri>
</aff>
```

## Article Meta

```xml
<!-- NEEDS_KITCHEN_SINK_SYNC, NEEDS_SCHEMA_SYNC -->
<article-meta>
  <title-group>...</title-group>
  <contrib-group content-type="author">...</contrib-group>
  <contrib-group content-type="editor">...</contrib-group>
  <aff id="aff1">...</aff>
  <aff id="aff2">...</aff>
  <pub-date publication-format="print" date-type="pub" iso-8601-date="1999-01-29">
    <day>29</day>
    <month>01</month>
    <year>1999</year>
  </pub-date>
  <volume>318</volume>
  <issue>7187</issue>
  <fpage>837</fpage>
  <lpage>841</lpage>
  <history>...</history>
  <abstract>...</abstract>
</article-meta>
```

## Abstract

Use Case: Regular abstract

```xml
<!-- NEEDS_KITCHEN_SINK_SYNC, NEEDS_SCHEMA_SYNC -->
<abstract>
  <p>Optional abstract can contain</p>
</abstract>
```

Use Case: Custom abstract

```xml
<!-- NEEDS_KITCHEN_SINK_SYNC, NEEDS_SCHEMA_SYNC -->
<abstract abstract-type="executive-summary">
  <title>Digest<title>
  <p>An executive summary.</p>
</abstract>
```

## Article Title

```xml
<!-- NEEDS_KITCHEN_SINK_SYNC, NEEDS_SCHEMA_SYNC -->
<title-group>
  <article-title>Article title can contain <italic>italic</italic>, <bold>bold</bold>, <sup>superscript</sup> and <sub>subscript</sub></article-title>
  <trans-title-group xml:lang="es">
    <trans-title id="trans-title-1">Objeto de visión a acción manual en <italic id="italic-1">cortezas parietales</italic>, premotoras y motoras de macaco</trans-title>
  </trans-title-group>
</title-group>
```

## Figures

Use Case: Single figure

```xml
<!-- NEEDS_KITCHEN_SINK_SYNC, NEEDS_SCHEMA_SYNC -->
  <fig id="fig1">
    <label>Figure 1</label>
    <caption>
      <title>Figure 1 title</title>
      <p>Figure 1 caption</p>
    </caption>
    <graphic id="fig3a-graphic" mime-subtype="jpeg" mimetype="image" xlink:href="fig1.jpg" />
  </fig>
```

Use Case: Multi-panel figure

```xml
<!-- NEEDS_KITCHEN_SINK_SYNC, NEEDS_SCHEMA_SYNC -->
<fig-group id="fig3-group">
  <fig id="fig3a">
    <label>Figure 3A</label>
    <caption>
      <title>First panel</title>
      <p>First panel caption</p>
    </caption>
    <graphic id="fig3a-graphic" mime-subtype="jpeg" mimetype="image" xlink:href="fig3a.jpg" />
  </fig>
  <fig id="fig3b">
    <label>Figure 1B</label>
    <caption>
      <title>Second panel</title>
      <p>Second panel caption</p>
    </caption>
    <graphic id="fig3-graphic" mime-subtype="jpeg" mimetype="image" xlink:href="fig3b.jpg" />
  </fig>
</fig-group>
```

Use Case: Main Figure + Figure supplement

```xml
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
<!-- NEEDS_KITCHEN_SINK_SYNC, NEEDS_SCHEMA_SYNC -->
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