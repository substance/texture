# JATS4M - JATS for Machines

This specification defines a strict tagging style for JATS, with the goal of optimising for machine readability, avoiding redundancy and ensuring reusability. The premise is to have exactly one tagging style per use-case. E.g. there is only one way to tag a reference, author or affiliation.

## References

All references are expressed as structured `<element-citation>` records. Unlike JATS we define a strict pattern for each `publication-type` value.

Spec for `<element-citation>`:

publication-type|pattern
---|---
book|person-group[person-group-type=author]?, person-group[person-group-type=editor]?, edition?, year?, month?, day?, chapter-title?, source?, publisher-loc?, publisher-name?, fpage?, lpage?, page-range?, page-count?, elocation-id?, pub-id[pub-id-type='doi, pmid, isbn, entity']?
preprint|person-group[person-group-type='author'], article-title, source, year, month?, day?, pub-id[pub-id-type='doi, entity']?
clinicaltrial|person-group[person-group-type=sponsor]?, year?, month?, day?, article-title?, source?,pub-id[pub-id-type='doi, entity']?
confproc|person-group[person-group-type='author']?, article-title?, year?, month?, day?, conf-name?, source?, fpage?, lpage?, page-range?, elocation-id?, pub-id[pub-id-type='doi,entity']?
data|person-group[person-group-type='author']?, data-title?, source?, year?, month?, day?, pub-id[pub-id-type="accession, ark, doi, archive, entity"]?
periodical|person-group[person-group-type=author]?, article-title?, year?, month?, day?, source?, fpage?, lpage?, page-range?, volume?, pub-id[pub-id-type='doi, entity']?
journal|person-group[person-group-type=author]?, person-group[person-group-type=editor]?, year, month?, day?, article-title, source?, volume?, issue?, fpage?, lpage?, page-range?, elocation-id?, comment?, pub-id[pub-id-type='doi, pmid, entity']?
patent|person-group[person-group-type='inventor'], collab[type=assignee]?, article-title?, year?, month?, day?, source?, patent[country='xxx']?
report|person-group[person-group-type='author']?, source?, year?, month?, day?, publisher-name?, publisher-loc?, pub-id[pub-id-type='isbn, entity']?
software|person-group[person-group-type='author']?, year?, month?, day?, source?, version?, publisher-loc?, publisher-name?, pub-id[pub-id-type='doi, entity']?
thesis|person-group[person-group-type='author']?, year?, month?, day?, article-title?, publisher-name?, publisher-loc?, pub-id[pub-id-type='doi, entity']?
webpage|person-group[person-group-type='author']?, article-title?, uri?, year?, month?, day?, publisher-loc?, source?

Example for `<ref>`:

```xml
<ref id="r1">
  <element-citation publication-type="book">
    <person-group person-group-type="author">
      <collab>National Research Council</collab>
    </person-group>
    <year iso-8601-date="2003">2003</year>
    <source>Guidelines for the Care and Use of Mammals in Neuroscience and Behavioral Research</source>
    <publisher-loc>Washington, D.C</publisher-loc>
    <publisher-name>National Academies Press</publisher-name>
    <pub-id pub-id-type="doi">10.17226/10732</pub-id>
    <!-- Internal: links an element-citation with a record in the database -->
    <pub-id pub-id-type="entity">book-1</pub-id>
  </element-citation>
</ref>
```

### `<person-group>`

```
(collab, name)*
```

### `<name>`

```
surname?, given-names?, prefix?, suffix?
```

Related discussions: #238

## Authors

Spec for `<contrib-group>`:

```
(contrib[contrib-type=author|group-author])*
```

Spec for `<contrib contrib-type="author">`:

```
name, xref*
```

Spec for `<contrib contrib-type="group-author">`:

```
collab
```

Spec for `<collab>`:

```
named-content, uri?, contrib-group?
```

Example for `<contrib-group>`:


```xml
<contrib-group content-type="authors">
  <contrib contrib-type="author" equal-contrib="yes">
    <name>
      <surname>Church</surname><given-names>Deanna M.</given-names>
    </name>
    <xref ref-type="aff" rid="aff1"/>
  </contrib>
  <contrib contrib-type="group-author" equal-contrib="yes">
    <collab>
      <named-content content-type="name">The Mouse Genome Sequencing Consortium</named-content>
      <uri content-type="entity">organisation-25</uri>
      <contrib-group>
        <contrib>
          <name>
            <surname>Kelly</surname><given-names>Laura A.</given-names>
          </name>
        </contrib>
        <contrib>
          <name>
            <surname>Randall</surname><given-names>Daniel Lee</given-names>
            <suffix>Jr.</suffix>
          </name>
        </contrib>
      </contrib-group>
    </collab>
  </contrib>
</contrib-group>
```

Related discussions: #277, #239

## Editors

Example:

```xml
<contrib-group content-type="editors">
  <contrib contrib-type="editor">
    <name>
      <surname>Kastner</surname><given-names>Sabine</given-names>
    </name>
    <xref ref-type="aff" rid="aff1"/>
    <contrib-id contrib-id-type="entity">person-2</contrib-id>
  </contrib>
</contrib-group>
```

## Affiliations

Spec for `<aff>`:

```
institution[content-type=orgname],
institution[content-type=orgdiv1]?, institution[content-type=orgdiv2]?,
institution[content-type=orgdiv3]?, addr-line[content-type=street-address]?,
addr-line[content-type=complements]?,
city?, state?, postal-code?, country?,
phone?, fax?, email?, uri[content-type=link]?
```

Example:

```xml
<aff id="aff1">
  <institution content-type="orgname">German Primate Center GmbH</institution>
  <institution content-type="orgdiv1">Neurobiology Laboratory</institution>
  <city>Göttingen</city>
  <country>Germany</country>
  <uri content-type="entity">organisation-1</uri>
</aff>
```

Related discussions: #240


## Figures

Spec for `<fig>`:

```
object-id[pub-id-type=doi]?, caption?, graphic
```

```xml
<fig id="fig1">
  <object-id pub-id-type="doi">...</object-id>
  <caption>
    <title>This is the figure that shows everything</title>
    <p>Lorem ipsum</p>
  </caption>
  <graphic xlink:href="images/fig1"/>
</fig>
```


## Reproducible Figure

*NOTE: This is considered an extension to JATS for reproducible elements. It is not supported by Texture natively.*

Spec for `fig[fig-type=repro-fig]`:

```
object-id[pub-id-type=doi]?, caption?, alternatives
```

Example for `fig[fig-type=repro-fig]`

```xml
<fig id="f1" fig-type="repro-fig">
  <caption>
    <title>Biodiversity on Mars</title>
    <p>Lorem ipsum</p>
  </caption>
  <alternatives>
    <code specific-use="source" language="mini"><![CDATA[plot([11,98])]]></code>
    <code specific-use="output" language="json"><![CDATA[{"execution_time": 1, "value_type": "plot-ly", "value": {} }]]></code>
  </alternatives>
</fig>
```


Spec for `fig > alternatives`:

```
code[specific-use=source], code[specific-use=output]
```

Spec for `fig > alternatives > code`:

```
#PCDATA
```




## Media

Spec for `<media>`:

```
object-id[pub-id-type=doi]?, caption?
```

Example for `<media>`:

```xml
<media id="media1" mime-subtype="mp4" mimetype="video" xlink:href="elife-15278-media1.mp4">
  <object-id pub-id-type="doi">10.7554/eLife.15278.004</object-id>
  <caption>
    <title>Experimental task.</title>
    <p>A monkey grasped and held highly variable objects presented on a PC-controlled turntable. Note: For presentation purposes, the video was captured in the light.
    </p>
  </caption>
</media>
```

Related discussions: #266
