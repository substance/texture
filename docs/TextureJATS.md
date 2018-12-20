# Texture JATS

This document shows examples for Texture JATS usage. The premise of TextureJATS is to have exactly one tagging style per use-case. E.g. there is only one way to tag a reference, author or affiliation. Additionally we define a set of optional extensions to model reproducible elements (cells) in JATS. This work is inspired but not related to JATS4R, a similar effort to make JATS more reusable.

## Abstract

### Regular abstract

```xml
<!-- NEEDS_KITCHEN_SINK_SYNC, NEEDS_SCHEMA_SYNC -->
<abstract>
  <p>Optional abstract.</p>
</abstract>
```

### Custom abstract

```xml
<!-- NEEDS_KITCHEN_SINK_SYNC, NEEDS_SCHEMA_SYNC -->
<abstract abstract-type="executive-summary">
  <title>Digest<title>
  <p>An executive summary.</p>
</abstract>
```

## Affiliation

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

## Chapter

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

## Contributor

The are different types of contributors. Each of them are collected in a separate `<contrib-group>` element.

### Author

```xml
<!-- NEEDS_KITCHEN_SINK_SYNC, NEEDS_SCHEMA_SYNC -->
<!-- content-type="authors" or content-type="author"? -->
<!-- role (with free form text) should be implemented but vocab-* attributes awaiting JATS4R confirmation -->
<!-- present address is realised with a reference to an affiliation. eLife would like to use free-form footnote instead -->
<contrib-group content-type="authors">
  <contrib contrib-type="author" equal-contrib="yes" corresp="no" deceased="no">
    <name>
      <surname>Schaffelhofer</surname>
      <given-names>Stefan</given-names>
    </name>
    <xref ref-type="aff" rid="aff1" />
    <xref ref-type="aff" rid="aff2" />
    <xref ref-type="present-address" rid="aff1" />
    <xref ref-type="fn" rid="conf1"/>
    <xref ref-type="award" rid="fund1" />
    <role vocab="CRediT" vocab-identifier="http://dictionary.casrai.org/Contributor_Roles" vocab-term="Conceptualization" vocab-term-identifier="http://dictionary.casrai.org/Contributor_Roles/Conceptualization">study designer</role>
    <role vocab="CRediT" vocab-identifier="http://dictionary.casrai.org/Contributor_Roles" vocab-term="Data_curation" vocab-term-identifier="http://dictionary.casrai.org/Contributor_Roles/Data_curation">data curator</role>
  </contrib>
</contrib-group>
```

## Group Author

```xml
TODO
```

## Figure

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

Use Case: Custom fields

```xml
<!-- NEEDS_KITCHEN_SINK_SYNC, NEEDS_SCHEMA_SYNC -->
<fig id="fig2">
  <label>Figure 2</label>
  <caption id="fig2-caption">
    <title>Figure 2</title>
    <p>Caption of main figure</p>
  </caption>
  <kwd-group kwd-group-type="exp-system">
    <label>Exp. System</label>
    <kwd>immunostaining</kwd>
    <kwd>confocal microscopy</kwd>
  </kwd-group>
  <kwd-group kwd-group-type="measured-variables">
    <label>Measured-Variables</label>
    <kwd>immunostaining</kwd>
    <kwd>confocal microscopy</kwd>
  </kwd-group>
  <graphic id="fig2-graphic" mime-subtype="jpeg" mimetype="image" xlink:href="fig2.jpg" />
</fig>
```

## Formula

```xml
<disp-formula id="disp-formula-1">
  <label>(1)</label>
  <tex-math><![CDATA[1+\frac{q^2}{(1-q)}+\frac{q^6}{(1-q)(1-q^2)}+\cdots=
\prod_{j=0}^{\infty}\frac{1}{(1-q^{5j+2})(1-q^{5j+3})},
\quad\quad \text{for }\lvert q\rvert<1.]]></tex-math>
</disp-formula>
```

## Inline Formula

```xml
<p>Some text <inline-formula id="inline-formula-1" content-type="math/tex"><tex-math>\sqrt(13)</tex-math></inline-formula> and more text</p>
```

## Inline Graphic

```xml
<p>Some text <inline-graphic id="inline-graphic-1" mimetype="image" mime-subtype="svg" xlink:href="fig3.svg"/> and more text.</p>
```

## Preformatted Text

```xml
<preformat id="_preformat-1" preformat-type="code"><![CDATA[import java.io._
class Reader(fname: String) {
  private val in =
    new BufferedReader(new FileReader(fname))
  @throws(classOf[IOException])
  def read() = in.read()
}]]></preformat>
```

## Supplementary File

Use Case: Stand-alone supplemntary file

```xml
<!-- NEEDS_KITCHEN_SINK_SYNC, NEEDS_SCHEMA_SYNC -->
<supplementary-material id="source-data-1" content-type="sdata" mimetype="application" mime-sub-type="zip" xlink:href="source-data-1.zip">
  <label>Source data 1.</label><!-- auto-generated, based on counter grouped by content-type -->
  <caption>
    <title>Orthogroup clustering analysis</title>
  </caption>
</supplementary-material>
```

## Table

```xml
<table-wrap id="table1">
  <label>Table 1</label>
  <caption id="table1_caption">
    <title>Example Table</title>
    <p id="table1_caption_p1">This is a table example.</p>
  </caption>
  <table id="t1">
    <tbody>
      <tr id="t1_1">
        <th id="t1_1_1">A</th>
        <th id="t1_1_2">B</th>
        <th id="t1_1_3">C</th>
        <th id="t1_1_4">D</th>
      </tr>
      <tr id="t1_2">
        <td id="t1_2_1" colspan="2">1</td>
        <td id="t1_2_3" rowspan="2" colspan="2">3</td>
      </tr>
      <tr id="t1_3">
        <td id="t1_3_1">5</td>
        <td id="t1_3_2" rowspan="2">Formatting in table cell <bold id="t1-bold-1">bold</bold>,<italic id="t1-italic-1">italic</italic>, <sub id="t1-sub-1">sub</sub>,<sup id="t1-sup-1">sup</sup>, <monospace id="t1-monospace-1">monospace</monospace></td>
      </tr>
      <tr id="t1_4">
        <td id="t1_4_1">9</td>
        <td id="t1_4_3">Hyper <ext-link id="t1-ext-link-1" ext-link-type="uri" xlink:href="http://substance.io">link</ext-link> in table cell.</td>
        <td id="t1_4_4">Reference citation in table cell <xref id="t1-xref-1" ref-type="bibr" rid="r7">[1]</xref></td>
      </tr>
      <tr id="t1_5">
        <td id="t1_5_1">Table footnote<xref id="t1-xref-2" ref-type="table-fn" rid="tfn1">*</xref></td>
        <td id="t1_5_2">Another table footnote<xref id="t1-xref-3" ref-type="table-fn" rid="tfn2">†</xref></td>
        <td id="t1_5_3">Table footnote with multiple targets<xref id="t1-xref-4" ref-type="table-fn" rid="tfn1 tfn2">*, †</xref></td>
        <td id="t1_5_4">16</td>
      </tr>
    </tbody>
  </table>
  <table-wrap-foot>
    <fn-group>
      <fn id="tfn1">
        <label>*</label>
        <p id="tfn1-p1">This is a table-footnote.</p>
      </fn>
      <fn id="tfn2">
        <label>†</label>
        <p id="tfn2-p1">Another table-footnote.</p>
      </fn>
    </fn-group>
  </table-wrap-foot>
</table-wrap>
```