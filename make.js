const b = require('substance-bundler')
const fs = require('fs')
const path = require('path')
// used to bundle example files for demo
const vfs = require('substance-bundler/extensions/vfs')

const DIST = 'dist/'
const TMP = 'tmp/'
const RNG_SEARCH_DIRS = [
  path.join(__dirname, 'src', 'article')
]

b.task('clean', function() {
  b.rm(DIST)
  b.rm(TMP)
})

b.task('assets', function() {
  vfs(b, {
    src: ['./data/**/*', './src/article/*.rng', './src/article/*.json'],
    dest: 'tmp/vfs.js',
    format: 'umd', moduleName: 'vfs'
  })
})

// compiles TextureJATS and does some evaluation
b.task('compile:schema', () => {
  _compileSchema('TextureJATS', 'src/article/TextureJATS.rng', RNG_SEARCH_DIRS, 'src/article')
})

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

// we used this internally just to get a single-file version of
// the offficial JATS 1.1 rng data set
function _singleJATSFile() {
  const SRC = 'data/rng/JATS-archive-oasis-article1-mathml3.rng'
  const DEST = 'src/article/JATS.rng'
  const entry = path.basename(SRC)
  b.custom(`Pulling JATS spec into a single file...`, {
    src: ['data/rng/*.rng'],
    dest: DEST,
    execute() {
      const { loadRNG } = require('substance')
      let rng = loadRNG(fs, ['data/rng'], entry)
      let xml = rng.serialize()
      b.writeSync(DEST, xml)
    }
  })
}

function _compileSchema(name, src, searchDirs, baseDir='generated', options = {} ) {
  const DEST = `tmp/${name}.data.js`
  const ISSUES = `tmp/${name}.issues.txt`
  const entry = path.basename(src)
  b.custom(`Compiling schema '${name}'...`, {
    src: ['data/rng/*.rng', 'src/**/*.rng'],
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

// starts a server when CLI argument '-s' is set
b.setServerPort(4000)
b.serve({ static: true, route: '/', folder: '.' })
