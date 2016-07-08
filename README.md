# Substance Scientist [![Build Status](https://travis-ci.org/substance/scientist.svg?branch=develop)](https://travis-ci.org/substance/scientist)

This is a work-in progress. The project name Scientist is temporary and may be changed with the first beta release.

## Install

Clone the repository.

```bash
$ git clone https://github.com/substance/scientist.git
```

Navigate to the source directory.

```bash
$ cd scientist
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

And navigate to [http://localhost:5001](http://localhost:5001)

To run the tests in the browser navigate to `http://localhost:5001/test`

To run the test suite headless:

```
$ npm test
```

## Usage

Here's how you can integrate Scientist into your web app.

```js
// app.js
var Scientist = require('substance-scientist');
var myScientistPackage = require('./myScientistPackage');
var configurator = new Scientist.Configurator(myScientistPackage);

window.onload = function() {
  window.app = Scientist.static.mount({
    mode: 'publisher', // or 'author' or 'reader'
    documentId: 'doc-1',
    configurator: configurator
  }, document.body);
};
```

Scientist is fully configurable. So you need to supply a custom configuration via a package defintion.

```js
// myScientistPackage.js
var MyXMLStore = require('../MyXMLStore');
var scientistPackage = require('substance-scientist/packages/scientist/package');
var path = require('path');

module.exports = {
  name: 'my-scientist',
  configure: function(config) {
    // Use the default Scientist package
    config.import(scientistPackage);

    // Define XML Store
    config.setXMLStore(MyXMLStore);
    // Add your custom app styles
    config.addStyle(__dirname, 'my-scientist.scss');
  }
};
```

In order to connect Scientist to a backend you need to define an XML Store:

```js
// MyXMLStore.js
var oo = require('substance/util/oo');
var request = require('substance/util/request');

function MyXMLStore() {}

MyXMLStore.Prototype = function() {
  this.readXML = function(documentId, cb) {
    request('GET', 'https://myserver.com/documents/'+documentId+'.xml', null, cb);
  };

  this.writeXML = function(documentId, xml, cb) {
    var data = {content: xml};
    var url = 'https://myserver.com/documents/'+documentId+'.xml'
    request('PUT', url, data, cb);
  };
};

oo.initClass(MyXMLStore);

module.exports = MyXMLStore;
```


## Bundle examples

```bash
$ npm run bundle
```

## Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Roadmap

### Alpha 2

*ETA: 25 July 2016*

- Update to Substance Beta 5
- Author:
  - Cover editing (title, abstract, authors, etc.)
- Publisher:
  - Front matter editor (JATS `<front>`)
  - XML navigation bar (breadcrumbs, similar to XPath)
  - Edit references (XML, for fixing)
  - Add references (template for `<element-citation>`)

### Beta

*ETA: Fall 2016*

- Creating content (contextual)
- Add references via CrossRef search or pasting BibTex
- Support more elements
- Extended JATS, [Stencila](https://stenci.la/) Package

# Credits

Scientist is developed by the [Substance Consortium](http://substance.io/consortium/) formed by the [Public Knowledge Project](https://pkp.sfu.ca/2016/04/27/substance-consortium/) (PKP), the [Collaborative Knowledge Foundation](http://coko.foundation/blog.html#substance_consortium) (CoKo) and [Érudit](https://apropos.erudit.org/fr/creation-dun-consortium-autour-de-substance/).

Thanks goes to the following people, who made Scientist possible:

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
