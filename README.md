# Texture [![Build Status](https://travis-ci.org/substance/texture.svg?branch=master)](https://travis-ci.org/substance/texture)

Texture is a toolset for the production of scientific content. It uses the [Dar Format](https://github.com/substance/dar), which is a stricter form of JATS, the de facto standard for archiving and interchange of scientific open-access contents with XML.
![Texture User Interface](texture.png)

## Roadmap

Texture is still in a beta stage: there are likely to be missing features, bugs and API changes. But we would :heart: to get your suggestions and :bug: reports.

- ✓ = ready for production use
- Beta = ready for beta user testing

We generally only plan one or two releases ahead, and aim ship regularly.

Feature                                 | Ready
:-------------------------------------- | :------------:
General editing                         | Beta
Copy & Paste (from Word, etc.)          | Beta
Find and Replace                        | Beta
Auto-numbered labels (`xref`, `fig`, etc. ) | Beta
Reference editing (`element-citation`)  | Beta
Authors and Affiliations                | Beta
[Dar](https://github.com/substance/dar) Storage | Beta
Article Record (`issue`, `fpage`, etc.) | September 2018
Translations                            | September 2018
Track Changes                           | September 2018
PubMed and CrossRef verification of references                           | September 2018
Fundref verification                    | September 2018
Group authors                           | September 2018
**Supported Content**                   |
Paragraph                               | ✓
Heading                                 | ✓
Math                                    | September 2018
List                                    | September 2018
Blockquote                              | ✓
Figure                                  | ✓
Table                                   | Beta
Bold & Italic                           | ✓
Ext-Link                                | ✓
Subscript & Superscript                 | ✓


## Install

*You need Node 8.x installed on your system.*

Clone the repository.

```bash
$ git clone https://github.com/substance/texture.git
```

Navigate to the source directory.

```bash
$ cd texture
```

Install via npm.

```bash
$ npm install
```

Start the dev server.

```bash
$ npm start
```

And navigate to [http://localhost:4000](http://localhost:4000/?archive=kitchen-sink&storage=fs).

You can save your document changes by pressing `CommandOrControl+S`.

To test with your own JATS-documents, just replace the contents of `data/kitchen-sink/manuscript.xml`.

## Texture Desktop

We also offer Texture wrapped in an Electron application.

```bash
$ npm run app
```

To package the application for distribution do the following:

```bash
$ npm run release
```

## License

Texture is open source, and you are legally free to use it commercially. If you are using Texture to make profit, we expect that you help [fund its development and maintenance](http://substance.io/consortium/).

## Credits

Texture is developed by the [Substance Consortium](http://substance.io/consortium/) formed by the [Public Knowledge Project](https://pkp.sfu.ca/2016/04/27/substance-consortium/) (PKP), the [Collaborative Knowledge Foundation](http://coko.foundation/blog.html#substance_consortium) (CoKo), [SciELO](http://www.scielo.org/),  [Érudit](https://apropos.erudit.org/fr/creation-dun-consortium-autour-de-substance/) and [eLife](https://elifesciences.org/).

The following people make Texture possible (in random order):

- Alex Garnett (leadership, concept)
- Juan Pablo Alperin (leadership, concept)
- Alex Smecher (concept, dev)
- Kristen Ratan (leadership)
- Adam Hyde (leadership)
- Jure Triglav (concept, dev)
- Tanja Niemann (leadership)
- Michael Aufreiter (dev)
- Melissa Harrison (requirements)
- Giuliano Maciocci (requirements, concept)
- Naomi Penfold (leadership)
- Nick Duffield (design)
- Davin Baragiotta (concept, dev)
- David Cormier (dev)
- Sophy Ouch (design)
- Fabio Batalha Cunha dos Santos (leadership, concept)
- Oliver Buchtala (dev)
