# Substance Scientist [![Build Status](https://travis-ci.org/substance/scientist.svg?branch=devel)](https://travis-ci.org/substance/scientist)

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

<!--# Bundle examples
```bash
$ npm run bundle
```
-->

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
- Extended JATS, Stencila Package
