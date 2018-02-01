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
PUT /:id/ { version!, resources? }
```

Updates an archive of a specified version with the provided content.

```
"version": "AE2F112D",
"resources": {
  "manuscript.xml": {
    contentType: "xml",
    data: "<article>...</article>",
  }
}
```

Notes:
- a classical implementation just stores the data, but should consider the given version to detect write conflicts

## Discussion

Discuss how real-time protocol and such a HTTP backend could go together. The proposed interface goes more into the direction of single-user. Thinking of real-time collab more being a group-author could be a way, i.e. not every user is 'pushing' to the backend, only one of them, or the moderator bot (=CollubHub).

An idea for supporting something like 'offline' collaboration could be to add 'diffs' to the API:

```
PUT /:id/ { version!, resources?, diffs? }
```

```
"version": "AE2F112D",
"resources": {
  ...
},
"diffs": {
  "manuscript.xml": "...serialized operations..."
}
```

Persisting 'diffs' here we could implement an offline collub model on top of a classical system. Like a PR, diffs would be persisted in kind of a 'branch'. A client would need to do the actual (OT-based) merge eventually calling the regular API.

## Implementation

- provide a classical nodejs implementation (express)
- Persist files on the file-system
- Use nodegit (libgit wrapper) for versioning
- provide a client implementation for the browser
- connect the client with the application

> There are two major tracks: client-server communication, and application integration.