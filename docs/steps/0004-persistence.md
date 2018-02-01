# Persistence for Document Archives

(Work in progress)

This article is a proposal for a server API interface and possible technical solutions for persisting Document Archives.
The architecture should allow for simple backends as well for 'fancy' implementations, e.g. it should be possible to achieve something useful in a classical PHP stack, maybe with a certain degree of degradation, while some features such as real-time collaboration may require a more sophisticated implementation.

With the Texture we are developing a first prototype implementation of this client-server architecture.

## Proposal

HTTP based server API:

```
GET localhost:5000/:id
PUT localhost:5000/:id
```

A proxy for exposing assets is handy in many cases, so we can implement:

```
GET localhost:5000/:id/assets/:file
```

Retrieve a (raw) archive as a record containing something like this

```js
{
  version: "AE2F112D",
  resources: {
    "manifest.xml": {
      encoding: "utf8",
      data: "<archive>...</archive>",
      size: 1723,
      createdAt: 202399323,
      updatedAt: 223213123,
    },
    "manuscript.xml": {
      encoding: "utf8",
      data: "<article>...</article>",
      size: 3534,
      createdAt: 202399323,
      updatedAt: 223213123,
    },
    "fig1.png": {
      encoding: "url", // in the write case we have encoding: 'hex' and data has the payload
      data: 'http://localhost:4000/api/assets/kitchen_sink/fig1.png',
      size: 102032,
      createdAt: 202399323,
      updatedAt: 223213123,
    }
  }
}
```

Notes:
- The server is allowed to 'forward' the location of the data by providing 'contentType=url' together with a 'url'. This is particularly useful for large binaries
- Textual content is typically inlined
- DISCUSS: maybe an option to control whether all content should be included,
  or the opposite, and only URLs (e.g. for sync'ing )
- TODO: probably we should add 'encoding' for text content
- TODO: for the shared server environment we also need a way to create a new archive. I would prefer to let the client provide the blue-print (makes the server implementation easier). Maybe we can use the `POST` endpoint for that, too, but maybe with explicit flag provided to indicate 'that it should create if not exist'. 

> DISCUSS: we want to use the implementation in a shared or stand-alone environment. E.g. a cli tool start a server instance just for a single folder. In this case the endpoint would just be 'GET /'.
> On the other hand in a shared server, i.e. a server that serves multiple archives at the same time, there we need the ':id' routes.


```
PUT /:id/ { version!, resources? }
```

Updates an archive of a specified version with the provided content.

```
"version": "AE2F112D",
"resources": {
  "manuscript.xml": {
    encoding: "utf8",
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

### Classical express backend

Implement the proposed endpoints in express. Consider that this implementation will be used in two environments: started by CLI serving only a single archive, and started as a shared server for multiple archives.
Persist the files on the file-system using async `fs` API.

### CLI version

Run the same server via CLI as a single-archive backend, i.e., no routes for different archives.

This is how it should work:

```
node storageServer.js ~/Users/michael/my-documents # starts server like at localhost:5000 with file api
npm start
http://localhost:4000?dar=localhost:5000/example
```

If no path is provided we read and write the `data/kitche_sink` that is in the repo.

### Client 

Implement a client to be run in the browser that connects to the server endpoint, loading the raw archive, turning it into a *Buffer* with EditorSessions. This Buffer will not be persisted in the browser based implementation, only in a future Electron integration. When saving, the Buffer should be transmitted to the server endpoint.

### Future

- Using nodegit to create a commit when updating an archive. Then we probably want to allow to pass a message with the update.
- expose version history in the client
- off-line collaboration: storing diffs together when uploading, and providing a way to merge pull-requests.
