# Texture [![Build Status](https://travis-ci.org/substance/texture.svg?branch=develop)](https://travis-ci.org/substance/texture)

Texture is a collection of components for realizing content production systems. It has first-class support for JATS, the de facto standard for archiving and interchange of scientific open-access contents with XML.

![Texture User Interface](texture.png)

## Install

Clone the repository.

```bash
$ git clone https://github.com/substance/texture.git
```

Navigate to the source directory.

```bash
$ cd texture
```

At the moment, the default branch provides the develop version.
To get the latest stable version switch to the `master` branch:

```bash
$ git checkout master
```

Install via npm

```bash
$ npm install
```

Start the dev server

```bash
$ npm run start
```

And navigate to [http://localhost:5555](http://localhost:5555)

To run the tests in the browser navigate to `http://localhost:5555/test`

To run the test suite headless:

```
$ npm test
```

## Usage

Here's how you can integrate Texture into your web app.

```js
// app.js
import { Texture, TextureConfigurator, AuthorPackage } from 'substance-texture'
import MyXMLStore from './MyXMLStore'

let configurator = new TextureConfigurator()
configurator
  .import(AuthorPackage)
  .setXMLStore(MyXMLStore)

window.onload = function() {
  window.app = Texture.mount({
    documentId: 'doc-1',
    configurator: configurator
  }, document.body)
}
```

Texture is fully configurable. So you need to supply a custom configuration by importing packages.

In order to connect Texture to a backend you need to define an XML Store:

```js
// MyXMLStore.js
import { request } from 'substance'

export default class MyXMLStore {
  readXML(documentId, cb) {
    request('GET', 'https://myserver.com/documents/'+documentId+'.xml', null, cb)
  }

  writeXML(documentId, xml, cb) {
    var data = { content: xml }
    var url = 'https://myserver.com/documents/'+documentId+'.xml'
    request('PUT', url, data, cb)
  }
}
```

## Bundle examples

```bash
$ npm run bundle
```

## Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Roadmap

### Alpha 3

*ETA: November 2016*

Goal is to provide proof of concepts for the discussed tagging workflow (get from unstructured text to structured JATS). For example:

- Quality measures for Meta data (#72)
- Identify authors in the text and turn them into <contrib> nodes (#75)
- Turn a sequence of paragraphs into a reference list (#74)
- Identify title as text and tag as article title (#76)
- Update to Substance Beta 6

### Alpha 4

Elaborate results of Alpha 3 based on an agreed minimal set of functionalities. For example:

- Document structure fixes (tag headings and set heading level)
- Author tagging
- Figure tagging (caption editing etc.)
- Figure placement
- Bibliography tagging

With these results organisations can start to test Texture-based QC-workflow with real articles.

*ETA: Winter 2016*

### Beta

Feature-complete release ready to be tested by publishers.

# Credits

Texture is developed by the [Substance Consortium](http://substance.io/consortium/) formed by the [Public Knowledge Project](https://pkp.sfu.ca/2016/04/27/substance-consortium/) (PKP), the [Collaborative Knowledge Foundation](http://coko.foundation/blog.html#substance_consortium) (CoKo) and [Érudit](https://apropos.erudit.org/fr/creation-dun-consortium-autour-de-substance/).

Thanks goes to the following people, who make Texture possible:

- Alex Garnett (leadership, concept)
- Juan Pablo Alperin (leadership, concept)
- Alex Smecher (concept, dev)
- Kristen Ratan (leadership)
- Adam Hyde (leadership)
- Jure Triglav (concept, dev)
- Tanja Niemann (leadership)
- Davin Baragiotta (concept, dev)
- David Cormier (dev)
- Sophy Ouch (design)
- Michael Aufreiter (dev)
- Oliver Buchtala (dev)
- ...
