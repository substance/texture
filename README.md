# Texture [![Build Status](https://travis-ci.org/substance/texture.svg?branch=master)](https://travis-ci.org/substance/texture)
[![Code Quality: Javascript](https://img.shields.io/lgtm/grade/javascript/g/substance/texture.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/substance/texture/context:javascript)
[![Total Alerts](https://img.shields.io/lgtm/alerts/g/substance/texture.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/substance/texture/alerts)

Texture is a toolset designed for the production of scientific content. It uses the [Dar Format](http://github.com/substance/dar), which defines a stricter form of the [JATS Archiving and Interchange Tag Set ("green" v. 1.1)](https://jats.nlm.nih.gov/archiving/1.1/) XML standard.

![Texture User Interface](texture.png)


## Feature requests and Feedback

Feature requests can be made via the GitHub issues using a Feature request template. It will be assessed and costed, then scheduled accordingly in collaboration with the requesting organisation. Please feedback any problems with the product using the Bug template.

## Releases and Roadmap

[The current release](https://github.com/substance/texture/releases/) is *Texture 2.3*, released 12 April 2019. Texture is currently in beta and optimised for publishers. An updated version will add missing features to fully support scientific authoring.

See [the Roadmap section of the Product Brief](https://docs.google.com/document/d/1ZOjKrQZOndU9G12bVaXmFt56aWRW4kJSDjaMjcxSHSc/edit#heading=h.gsyknu9gn8x).

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

### MacOS

Running the installed application from command line:

```
open -a /Applications/Texture.app my-article.dar
```

## Running tests

Running tests in NodeJS (like it is done on TravisCI):

```bash
npm test
```

Debugging NodeJS tests:

```
node make test-nodejs && node --inspect-brk --require esm test/index.js
```
Then open `chrome://inspect`. It should show a `Remove Target` for the test script. Clicking on `inspect` opens a new window with Chrome Developer Tools.

Running a some NodeJS tests:

```
TEST="Model" npm test
```

The environment variable `TEST` is used as a filter to select test that have that pattern in their name.


Running tests in the browser:
```
node make test-browser -w -s
```
Then open `localhost:4000/test`.

## License

Texture is open source (MIT license), and you are legally free to use it commercially. If you are using Texture to make profit, we expect that you help [fund its development and maintenance](http://substance.io/consortium/).

## Credits

Texture is developed by the [Substance Consortium](http://substance.io/consortium/) formed by the [Public Knowledge Project](https://pkp.sfu.ca/2016/04/27/substance-consortium/) (PKP), the [Collaborative Knowledge Foundation](http://coko.foundation/blog.html#substance_consortium) (CoKo), [SciELO](http://www.scielo.org/),  [Érudit](https://apropos.erudit.org/fr/creation-dun-consortium-autour-de-substance/) and [eLife](https://elifesciences.org/).

The following people make Texture possible (in random order):

- Alex Garnett (leadership, concept)
- Juan Pablo Alperin (leadership, concept)
- Alex Smecher (concept, dev)
- Tanja Niemann (leadership)
- Melissa Harrison (requirements)
- Giuliano Maciocci (requirements, concept)
- Naomi Penfold (leadership)
- Nick Duffield (design)
- Davin Baragiotta (concept, dev)
- David Cormier (dev)
- Sophy Ouch (design)
- Philipp Zumstein (dev)
- Fabio Batalha Cunha dos Santos (leadership, concept)
- James Gilbert (UX, requirements)
- Luciano Gabriel Panepucci (UX)
- Michael Aufreiter (dev)
- Oliver Buchtala (dev)
- Daniel Beilinson (dev)
