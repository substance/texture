# Texture API

A Javascript API to modify content in a Texture article. This is particularly useful for collecting metadata, such as authors, affiliations, references, keywords etc. This is a format-agnostic abstraction. So it means the data can be serialised in different ways, so Texture is not tightly bound to JATS. We could also use HTML + JSON to represent an article and its metadata.

* [Affiliations](#affiliations)
* [Authors](#authors)
* [Editors](#editors)
* [Awards](#awards)
* [References](#references)
* [Keywords](#keywords)
* [Subjects](#subjects)

## Contribs

Manage contributor data, such as authors, editors, affiliations, awards.

```js
let contribs = api.getContribsModel()
```

### Affiliations

Print affiliations, depending on the order of authors. If you haven't assigned any affiliations, this list will be empty.

```js
contribs.getAffiliations() 
```

```js
[{ id: 'aff1', ... }, ...]
```

Add new affiliation:

```js
contribs.addAffiliation({
  id: 'aff1',
  name: 'German Primate Center GmbH',
  division1: 'Neurobiology Laboratory',
  city: 'Göttingen',
  country: 'Germany'
})
```

Get affiliation:

```js
contribs.getAffiliation('aff1')
```

Update an affiliation:

```js
contribs.updateAffiliation('aff1', {...})
```

Remove an affiliation:

```js
contribs.deleteAffiliation('aff1')
```

### Authors

Get all authors in order:

```js
contribs.getAuthors()
```


```js
[
  {
    id: 'author1',
    type: 'person',
    surname: 'Schaffelhofer',
    givenNames: 'Stefan',
    suffix: 'Phd',
    email: 'stefan@schaffelhofer.com',
    // affiliations related to this paper
    affiliations: ['org1'],
    presentAffiliation: ['org1'],
    // awards related to this paper
    awards: ['fund1'],
    equalContrib: true,
    corresp: true,
  },
  // Groups are considered one independent entity (not reusing person entry for members)
  // When updating via API, a whole new record is written
  {
    id: 'author2',
    type: 'group',
    affiliations: ['org2'],
    presentAffiliation: ['org2'],
    awards: ['fund1'],
    members: [
      {
        surname: 'Kelly',
        givenNames: 'Laura A.',
        email: 'stefan@schaffelhofer.com',
        affiliations: ['org2'],
        awards: ['fund1'],
        role: 'Writing Group'
      },
      {
        surname: 'Randall',
        givenNames: 'Daniel Lee',
        suffix: 'Jr.',
        email: 'stefan@schaffelhofer.com',
        affiliations: ['org3'],
        awards: ['fund1'],
        role: 'Lab Group'
      }
    ]
  }
]
```

To add a new author:

```js
contribs.addAuthor({...})
```

Update an author:

```js
contribs.updateAuthor('author1', {...})
```

Delete an author:

```js
contribs.deleteAuthor('author3')
```

To change the position of an author in the author list:

```js
contribs.moveAuthor('author4', 0) // move to position 0
```

### Editors

Pretty much the same as with authors, except there's no type attribute needed. Use the following methods:

```js
contribs.getEditors(data)
contribs.addEditor(data)
contribs.updateEditor(id, data)
contribs.moveEditor(id, pos)
contribs.deleteEditor(id)
```

### Awards

Add an award (grant), which can then be referenced from an author using the `awards` property. 

```js
contribs.addAward({
  id: 'fund1',
  institution: 'Howard Huges Medical Institute',
  awardId: 'F32 GM089018'
})
```

## References

```js
let references = this.context.api.getReferences()
```

### Get Reference

```js
references.getReference('r1')
```

Result:

```js
{
  "type": "book",
  "id": "r1",
  "authors": [
    {
      "givenNames": "JA",
      "surname": "Coyne"
    },
    {
      "givenNames": "HA",
      "surname": "Orr"
    }
  ],
  "translators": [],
  "title": "Speciation and its consequences",
  "volume": "",
  "edition": "",
  "publisherLoc": "Sunderland, MA",
  "publisherName": "Sinauer Associates",
  "year": "1989"
}
```

### Add Reference

```js
references.addReference({
  id: "r2",
  type: "journal-article",
  "title": "....",
  ...
})
```

### Update a Reference

```js
references.updateReference('r2', {
  "title": "....",
  ...
})
```

### Get label for a reference:

```js
references.getLabel('r2') // =>  e.g. [2]
```

### Render reference

Returns the rendered HTML string (without label)

```js
references.renderReference('r2')
```


### Get bibliography

```js
references.getBibliography()
```

Result:

```js
[
  {
     label: '[1]',
     data: {id: 'r1', type: 'book', ...}
  }
]
```


## Metadata

```js
let meta = api.getMeta()
```

### Keywords

Add a keyword:

```js
meta.addKeyword('optogenetics', 'author-keyword')
meta.addKeyword('two-photon', 'author-keyword')
meta.addKeyword('Mouse', 'research-organism')
```

List all available keyword categories:

```js
meta.getKeywordCategories()
```

Result:

```js
['author-keyword', 'research-organism']
```

List keywords for a given category:

```js
meta.getKeywords('author-keyword')
```

```js
['optogenetics', 'two-photon']
```

### Subjects

Add a subject:

```js
meta.addSubject('Research Article', 'article-type')
meta.addSubject('Computational and Systems Biology', 'research-subject')
meta.addSubject('Epidemiology and Global Health', 'research-subject')
```

List all available keyword categories:

```js
meta.getSubjectCategories()
```

Result:

```js
['article-type', 'research-subject']
```

List keywords for a given category:

```js
meta.getSubjects('research-subject')
```

```js
['Computational and Systems Biology', 'Epidemiology and Global Health']
```

### Publication Dates

Set or overwrite publication date (month and day are optional)

```js
meta.setPubDate(2016, 3, 1)
```

Add publication history record:

```js
meta.addPubHistoryRecord('received', 2016, 3, 1)
```

Remove publication history record:

```js
meta.clearPubHistoryRecord('received')
```
