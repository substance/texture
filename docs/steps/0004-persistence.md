# Persistence for Document Archives

(Work in progress)

This article is a proposal for a server API interface and possible technical solutions for persisting Document Archives.
The architecture should allow for simple backends as well for 'fancy' implementations, e.g. it should be possible to achieve something useful in a classical PHP stack, maybe with a certain degree of degradation, while some features such as real-time collaboration may require a more sophisticated implementation.

With the Texture we are developing a first prototype implementation of this client-server architecture.

## Proposal

HTTP based server API:

```
GET /:id/ { version? }
```

Retrieve a (raw) archive as a record containing something like this

```
{
  uuid: "1111-2222-3333-4444",
  version: "AE2F112D",
  resources: {
    "manifest.xml": {
      type: "manifest",
      uuid: ...,
      schema: "<...Manifest-Schema-URL...>",
      contentType: "xml",
      data: "<archive>...</archive>",
      size: 1723,
      createdAt: 202399323,
      updatedAt: 223213123,
    },
    "manuscript.xml": {
      type: "article",
      uuid: ...,
      contentType: "xml",
      data: "<article>...</article>",
      schema: "<...JATS4M-Schema-URL...>",
      size: 3534,
      createdAt: 202399323,
      updatedAt: 223213123,
    },
    "fig1.png": {
      type: "image",
      uuid: ...,
      contentType: "url",
      url: "assets/0123344.png",
      size: 102032,
      createdAt: 202399323,
      updatedAt: 223213123,
    },
    "vid1.mp4": {
      type: "video",
      uuid: ...,
      contentType: "url",
      url: "http://s3.amazonaws.com/219818/24234234.mp4",
      size: 23102032,
      createdAt: 202399323,
      updatedAt: 223213123,
    },
  }
}
```

Notes:
- The server is allowed to 'forward' the location of the data by providing 'contentType=url' together with a 'url'. This is particularly useful for large binaries
- Textual content is typically inlined
- DISCUSS: maybe an option to control whether all content should be included,
  or the opposite, and only URLs (e.g. for sync'ing )
- TODO: probably we should add 'encoding' for text content

```
PUT /:id/ { version!, resources?, diffs? }
```

Updates an archive of a specified version with the provided content.

```
"version": "AE2F112D",
"resources": {
  "manuscript.xml": {
    contentType: "xml",
    data: "<article>...</article>",
  }
},
"diffs": {
  "manuscript.xml": "...serialized diff aka operations..."
}
```

Notes:
- a classical implementation just stores the data, considering the given version
- diffs are here to consider collab on top of a classical system. Like a PR it could persist temporary 'branches' but would need a client to actually 'merge'. But, full real-time collab should not be done this way, rather in the way we have done already (CollubHub).