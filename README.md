# Texture [![Build Status](https://travis-ci.org/substance/texture.svg?branch=devel)](https://travis-ci.org/substance/texture)

Texture is a toolset for the production of scientific content. It has first-class support for JATS, the de facto standard for archiving and interchange of scientific open-access contents with XML.
![Texture User Interface](texture.png)

## Roadmap

Texture is still at an early alpha stage: there are likely to be missing features, bugs and API changes. But we would :heart: to get your suggestions and :bug: reports.

- ![prod](https://img.shields.io/badge/status-prod-green.svg) = ready for production use
- ![beta](https://img.shields.io/badge/status-beta-yellow.svg) = ready for beta user testing
- ![alpha](https://img.shields.io/badge/status-alpha-red.svg) = ready for alpha testing; use with caution
- Planned for release (e.g. `Alpha 4`)

We generally only plan one or two releases ahead. We aim to do quaterly releases, towards a 1.0 release in 2018. Please see our more detailed [ROADMAP.md](ROADMAP.md) document.

Feature                                | Ready
:------------------------------------- | :------------:
General editing                        | ![beta](https://img.shields.io/badge/status-beta-yellow.svg)
Copy & Paste (from Word, etc.)         | ![beta](https://img.shields.io/badge/status-beta-yellow.svg)
Find and Replace                       | ![alpha](https://img.shields.io/badge/status-alpha-red.svg)
Auto-numbered labels (`xref`, `fig`, etc. ) | ![beta](https://img.shields.io/badge/status-beta-yellow.svg)
Reference editing (`element-citation`) | ![alpha](https://img.shields.io/badge/status-alpha-red.svg)
Authors and Affiliations               | ![alpha](https://img.shields.io/badge/status-alpha-red.svg)
Article Record (`issue`, `fpage`, etc.) | ![alpha](https://img.shields.io/badge/status-alpha-red.svg)
Translations                           | ![alpha](https://img.shields.io/badge/status-alpha-red.svg)
**Supported Content**                  |
Article Title                          | ![prod](https://img.shields.io/badge/status-prod-green.svg)
Abstract                               | ![prod](https://img.shields.io/badge/status-prod-green.svg)
Paragraph                              | ![prod](https://img.shields.io/badge/status-prod-green.svg)
Headings                               | ![prod](https://img.shields.io/badge/status-prod-green.svg)
Image                                  | ![alpha](https://img.shields.io/badge/status-alpha-red.svg)
Figure                                 | ![alpha](https://img.shields.io/badge/status-alpha-red.svg)
List                                   | Alpha 4
Table                                  | ![alpha](https://img.shields.io/badge/status-alpha-red.svg)
Bold & Italic                          | ![prod](https://img.shields.io/badge/status-prod-green.svg)
Ext-Link                               | ![prod](https://img.shields.io/badge/status-prod-green.svg)
Subscript & Superscript                | ![prod](https://img.shields.io/badge/status-prod-green.svg)
Blockquote                             | ![beta](https://img.shields.io/badge/status-beta-yellow.svg)
**Transformations**                    |
JATS4R -> TextureJATS                  | ![alpha](https://img.shields.io/badge/status-alpha-red.svg)
TextureJATS -> JATS4R                  | ![alpha](https://img.shields.io/badge/status-alpha-red.svg)
JATS -> JATS4R                         | ![alpha](https://img.shields.io/badge/status-alpha-red.svg)
Testsuite for transformations          | Alpha 4
**Integration**                        |
Virtual Filesystem for XML + assets    | Alpha 4
Archive File Format (based on .tar.gz) | Beta 1
Desktop app for OSX, Windows, Linux    | Beta 1



## Usage

```js
const { Texture } = window.texture

window.app = Texture.mount({
  documentId: 'some-doc-id',
  readXML: function(documentId, cb) {
    // fetch an XML string to be read by the editor
  },
  writeXML: function(documentId, xml, cb) {
    // write the XML string to a store
  }
}, document.body)

```

See our [test example](examples/editor.html) for a complete integration scenario.


## Development

Clone the repository.

```bash
$ git clone https://github.com/substance/texture.git
```

Navigate to the source directory.

```bash
$ cd texture
```

At the moment, the default branch provides the develop version.
To get the latest stable version switch to the `master` branch.

```bash
$ git checkout master
```

Install via npm.

```bash
$ npm install
```

Start the dev server.

```bash
$ npm run start
```

And navigate to [http://localhost:4000](http://localhost:4000).


## License

Texture is open source, and you are legally free to use it commercially. If you are using Texture to make profit, we expect that you help [fund its development and maintenance](http://substance.io/consortium/).

## Credits

Texture is developed by the [Substance Consortium](http://substance.io/consortium/) formed by the [Public Knowledge Project](https://pkp.sfu.ca/2016/04/27/substance-consortium/) (PKP), the [Collaborative Knowledge Foundation](http://coko.foundation/blog.html#substance_consortium) (CoKo), [SciELO](http://www.scielo.org/) and [Érudit](https://apropos.erudit.org/fr/creation-dun-consortium-autour-de-substance/).

The following people make Texture possible:

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
- Fabio Batalha Cunha dos Santos (leadership, concept)
- Michael Aufreiter (dev)
- Oliver Buchtala (dev)
