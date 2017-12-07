# TextureXML - Internal schema powering the editor

This is the XML structure, used internally by Texture. It's largely the same as JATS4M, but we optimised the layout to be easier to manipulate. For instance in TextureXML, we use flat headings instead of nested sections, which allows for Word-like editing behaviour.

* NOTE: All data about contribs, references, affiliations live in a separate database outside of the XML. See `EntityDatabase.js` for the schema to be used*  

## Ref

Attributes for `ref`:

- Attribute `id` used as targets in `xref`
- Attribute `rid` points to entityId in entity database

Example for `ref`:

```xml
<ref id="r1" rid="journal-article-24"></ref>
```


## Contrib

Attributes for `contrib`:

- `id`
- `equal-contrib` signifies equal contribution
- `rid` points to entityId in entity database

Example for `contrib-group[content-type="authors"]`:

```xml
<contrib-group content-type="authors" equal-contrib="yes">
  <contrib rid="person-25" equal-contrib="yes"/>
  <contrib rid="organisation-1" equal-contrib="yes"/>
</contrib-group>
```

## Affiliation

Attributes for `<aff>`:

- `id`
- Attribute `rid` points to entityId in entity database

Example:

```xml
<aff id="aff1" rid="organisation-1"></aff>
```

## Cell


Content model for `cell`:

```
source-code, output
```

Example for `cell`:

```xml
<cell>
  <source-code language="mini"><![CDATA[6 * 7]]></source-code>
  <output language="json"><![CDATA[{}]]></output>
</cell>
```

## ReproFig


Content model for `repro-fig`:

```
object-id[pub-id-type=doi], title, caption, cell
```

Example for `repro-fig`:

```xml
<repro-fig>
  <object-id pub-id-type="doi">...</object-id>
  <title>Reproducible figure title</title>
  <caption>
    <p>Some caption</p>
  </caption>
  <source-code language="mini"><![CDATA[5 * 5]]></source-code>
  <output language="json"><![CDATA[{ "value": 25 }]]></output>
</repro-fig>
```
