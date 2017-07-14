const b = require('substance-bundler')
const fs = require('fs')
const path = require('path')
// used to bundle example files for demo
const vfs = require('substance-bundler/extensions/vfs')

const DIST = 'dist/'
const BUNDLE = 'bundle/'
const TMP = 'tmp/'
const RNG_SEARCH_DIRS = [
  path.join(__dirname, 'src', 'article')
]
const RNG_FILES = [
  'src/article/JATS-publishing.rng',
  'src/article/JATS4R.rng',
  'src/article/TextureJATS.rng'
]

b.task('clean', function() {
  b.rm(BUNDLE)
  b.rm(DIST)
  b.rm(TMP)
})

b.task('assets', function() {
  vfs(b, {
    src: ['./data/**/*.xml', './src/article/*.rng', './src/article/*.json'],
    dest: 'tmp/vfs.js',
    format: 'umd', moduleName: 'vfs'
  })
})

b.task('release-assets', function() {
  console.info('creating a release bundle at ./bundle')
  b.copy('./dist', './bundle/dist')
  b.copy('./tmp', './bundle/tmp')
  b.copy('./index.html', './bundle/index.html')
  b.copy('./examples', './bundle/examples')
  b.copy('./node_modules/font-awesome', './bundle/node_modules/font-awesome')
  b.copy('./node_modules/substance', './bundle/node_modules/substance')
})

b.task('single-jats-file', _singleJATSFile)

b.task('compile:jats', () => {
  _compileSchema('JATS-publishing', RNG_FILES[0], RNG_SEARCH_DIRS, RNG_FILES.slice(0,1))
})

b.task('compile:jats4r', () => {
  _compileSchema('JATS4R', RNG_FILES[1], RNG_SEARCH_DIRS, RNG_FILES.slice(0,2))
})

b.task('compile:texture-jats', () => {
  _compileSchema('TextureJATS', RNG_FILES[2], RNG_SEARCH_DIRS, RNG_FILES.slice(0,3))
})

b.task('compile:debug', () => {
  _compileSchema('JATS-publishing', RNG_FILES[0], RNG_SEARCH_DIRS, RNG_FILES.slice(0,1), { debug: true })
  _compileSchema('JATS4R', RNG_FILES[1], RNG_SEARCH_DIRS, RNG_FILES.slice(0,2), { debug: true })
  _compileSchema('TextureJATS', RNG_FILES[2], RNG_SEARCH_DIRS, RNG_FILES.slice(0,3), { debug: true })
})

b.task('compile:schema', ['compile:jats', 'compile:jats4r', 'compile:texture-jats'])

b.task('build:browser', ['compile:schema'], () => {
  _buildLib(DIST, true)
  _buildCSS(DIST, true)
})

b.task('build:browser:pure', ['compile:schema'], () => {
  _buildLib(DIST, false)
  _buildCSS(DIST, false)
})

b.task('build', ['clean', 'assets', 'build:browser'])

b.task('build:dev', ['clean', 'assets', 'build:browser:pure'])

// default build: creates a dist folder with a production bundle
b.task('default', ['clean', 'assets', 'build'])

// Creates a release bundle
b.task('release', ['default', 'release-assets'])

b.task('dev', ['clean', 'assets', 'build:dev'])

b.task('test', () => {
  // TODO implement a test-suite
  // A test-suite should cover
  // - basic functionality of components
  // - import from JATS -> restrictedJATS
  // - transformation between restrictedJATS and TextureJATS
})

/* HELPERS */

function _buildLib(DEST, transpileToES5) {
  b.js('./index.es.js', {
    target: {
      dest: DEST+'texture.js',
      format: 'umd', moduleName: 'texture', sourceMapRoot: __dirname, sourceMapPrefix: 'texture',
      // useStrict: !transpileToES5
    },
    external: [ 'substance', 'texture-jats'],
    globals: {
      'substance': 'substance',
      'texture-jats': 'TextureJATS'
    }
  })
}

function _buildCSS(DEST, transpileToES5) {
  b.css('texture.css', DEST+'texture.css', {variables: transpileToES5})
  b.css('./node_modules/substance/substance-pagestyle.css', DEST+'texture-pagestyle.css', {variables: transpileToES5})
  b.css('./node_modules/substance/substance-reset.css', DEST+'texture-reset.css', {variables: transpileToES5})
}

function _compileSchema(name, src, searchDirs, deps, options = {} ) {
  const DEST = `tmp/${name}.data.js`
  const ISSUES = `tmp/${name}.issues.txt`
  const entry = path.basename(src)
  b.custom(`Compiling schema '${name}'...`, {
    src: deps,
    dest: DEST,
    execute() {
      const { compileRNG, serializeXMLSchema, checkSchema } = require('substance')
      const xmlSchema = compileRNG(fs, searchDirs, entry)
      let schemaData = serializeXMLSchema(xmlSchema)
      b.writeSync(DEST, `export default ${JSON.stringify(schemaData)}`)
      if (options.debug) {
        const issues = checkSchema(xmlSchema)
        const issuesData = [`${issues.length} issues:`, ''].concat(issues).join('\n')
        b.writeSync(ISSUES, issuesData)
      }
    }
  })
}

// we used this internally just to get a single-file version of
// the offficial JATS 1.1 rng data set
function _singleJATSFile() {
  // const RNG_DIR = 'data/jats/archiving'
  // const ENTRY = 'JATS-archive-oasis-article1-mathml3.rng'
  // const DEST = 'src/article/JATS-archiving.rng'
  const RNG_DIR = 'data/jats/publishing'
  const ENTRY = 'JATS-journalpublishing-oasis-article1-mathml3.rng'
  const DEST = 'src/article/JATS-publishing.rng'
  b.custom(`Pulling JATS spec into a single file...`, {
    src: [RNG_DIR+'/*.rng'],
    dest: DEST,
    execute() {
      const { loadRNG } = require('substance')
      let rng = loadRNG(fs, [RNG_DIR], ENTRY)
      // sort definitions by name
      let grammar = rng.find('grammar')
      let others = []
      let defines = []
      grammar.getChildren().forEach((child) => {
        if (child.tagName === 'define') {
          defines.push(child)
        } else {
          others.push(child)
        }
      })
      defines.sort((a,b) => {
        const aname = a.getAttribute('name').toLowerCase()
        const bname = b.getAttribute('name').toLowerCase()
        if (aname < bname) return -1
        if (bname < aname) return 1
        return 0
      })
      grammar.empty()
      defines.concat(others).forEach((el) => {
        grammar.appendChild('\n  ')
        grammar.appendChild(el)
      })
      let xml = rng.serialize()
      b.writeSync(DEST, xml)
    }
  })
}

// starts a server when CLI argument '-s' is set
b.setServerPort(4000)
b.serve({ static: true, route: '/', folder: '.' })
