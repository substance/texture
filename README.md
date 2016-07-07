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

## Contribute

See [CONTRIBUTING.md](CONTRIBUTING.md).

# Bundle examples

```bash
$ npm run bundle
```

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
- Juan Pablo Alperin (concept)
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
