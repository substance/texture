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

const RNG_FILES = [
  'src/article/JATS-publishing.rng',
  'src/article/JATS-archiving.rng',
  'src/article/JATS4R.rng',
  'src/article/TextureJATS.rng'
]

b.task('clean', function() {
  b.rm(DIST)
  b.rm(TMP)
})

b.task('assets', function() {
  vfs(b, {
    src: ['./data/**/*.xml', './src/article/*.rng', './src/article/*.json'],
    dest: DIST+'/vfs.js',
    format: 'umd', moduleName: 'vfs'
  })
  b.copy('./assets', DIST+'assets')
  b.copy('./examples', DIST)
  b.copy('./node_modules/font-awesome', DIST+'font-awesome')
  b.copy('./node_modules/substance/dist', DIST+'substance/dist')
  _buildCSS(DIST)
})

b.task('single-jats-file', _singleJATSFile)

b.task('compile:jats', () => {
  _compileSchema('JATS-publishing', RNG_FILES[0], RNG_SEARCH_DIRS, RNG_FILES.slice(0,1))
  _compileSchema('JATS-archiving', RNG_FILES[1], RNG_SEARCH_DIRS, RNG_FILES.slice(1,2))
})

b.task('compile:jats4r', () => {
  _compileSchema('JATS4R', RNG_FILES[2], RNG_SEARCH_DIRS, RNG_FILES.slice(0,3))
})

b.task('compile:texture-jats', () => {
  _compileSchema('TextureJATS', RNG_FILES[3], RNG_SEARCH_DIRS, RNG_FILES.slice(0,4))
})

b.task('compile:debug', () => {
  _compileSchema('JATS-publishing', RNG_FILES[0], RNG_SEARCH_DIRS, RNG_FILES.slice(0,1), { debug: true })
  _compileSchema('JATS-archiving', RNG_FILES[1], RNG_SEARCH_DIRS, RNG_FILES.slice(1,2), { debug: true })
  _compileSchema('JATS4R', RNG_FILES[2], RNG_SEARCH_DIRS, RNG_FILES.slice(0,3), { debug: true })
  _compileSchema('TextureJATS', RNG_FILES[3], RNG_SEARCH_DIRS, RNG_FILES.slice(0,4), { debug: true })
})

b.task('compile:schema', ['compile:jats', 'compile:jats4r', 'compile:texture-jats'])

b.task('build:browser', ['compile:schema'], () => {
  _buildLib(DIST, 'browser')
})

b.task('build:nodejs', ['compile:schema'], () => {
  _buildLib(DIST, 'nodejs')
})

// default build: creates a dist folder with a production bundle
b.task('default', ['clean', 'assets', 'build:browser'])
b.task('dev', ['default'])

b.task('publish', ['clean', 'assets', 'compile:schema'], () => {
  _buildLib(DIST, 'all')
})

b.task('test', () => {
  // TODO implement a test-suite
  // A test-suite should cover
  // - basic functionality of components
  // - import from JATS -> restrictedJATS
  // - transformation between restrictedJATS and TextureJATS
})

/* HELPERS */

function _buildLib(DEST, platform) {
  let targets = []
  if (platform === 'browser' || platform === 'all') {
    targets.push({
      dest: DEST+'texture.js',
      format: 'umd', moduleName: 'texture', sourceMapRoot: __dirname, sourceMapPrefix: 'texture'
    })
  }
  if (platform === 'nodejs' || platform === 'all') {
    targets.push({
      dest: DEST+'texture.cjs.js',
      format: 'cjs'
    })
  }
  if (platform === 'es' || platform === 'all') {
    targets.push({
      dest: DEST+'texture.es.js',
      format: 'es'
    })
  }
  b.js('./index.es.js', {
    targets,
    external: ['substance'],
    globals: {
      'substance': 'substance',
    }
  })
}

function _buildCSS(DEST) {
  b.css('texture.css', DEST+'texture.css')
  b.css('./node_modules/substance/substance-pagestyle.css', DEST+'texture-pagestyle.css')
  b.css('./node_modules/substance/substance-reset.css', DEST+'texture-reset.css')
}

function _compileSchema(name, src, searchDirs, deps, options = {} ) {
  const DEST = `tmp/${name}.data.js`
  const ISSUES = `tmp/${name}.issues.txt`
  const SCHEMA = `tmp/${name}.schema.md`
  const entry = path.basename(src)
  b.custom(`Compiling schema '${name}'...`, {
    src: deps,
    dest: DEST,
    execute() {
      const { compileRNG, checkSchema } = require('substance')
      const xmlSchema = compileRNG(fs, searchDirs, entry)
      b.writeSync(DEST, `export default ${JSON.stringify(xmlSchema)}`)
      b.writeSync(SCHEMA, xmlSchema.toMD())
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
  [{
    RNG_DIR: 'data/jats/archiving',
    ENTRY: 'JATS-archive-oasis-article1-mathml3.rng',
    DEST: 'src/article/JATS-archiving.rng',
  },
  {
    RNG_DIR: 'data/jats/publishing',
    ENTRY: 'JATS-journalpublishing-oasis-article1-mathml3.rng',
    DEST: 'src/article/JATS-publishing.rng',
  }].forEach(({ RNG_DIR, ENTRY, DEST}) => {
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
  })
}

// starts a server when CLI argument '-s' is set
b.setServerPort(4000)
b.serve({ static: true, route: '/', folder: './dist' })
