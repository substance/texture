const b = require('substance-bundler')
const fs = require('fs')
const path = require('path')
const fork = require('substance-bundler/extensions/fork')
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
  b.copy('./data', DIST+'data')
  b.copy('./node_modules/font-awesome', DIST+'font-awesome')
  b.copy('./node_modules/substance/dist', DIST+'substance/dist')

  b.css('texture.css', DIST+'texture.css')
  b.css('./node_modules/substance/substance-pagestyle.css', DIST+'texture-pagestyle.css')
  b.css('./node_modules/substance/substance-reset.css', DIST+'texture-reset.css')
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

b.task('build:lib', ['compile:schema'], () => {
  _buildLib(DIST, 'all')
})

b.task('build:app', ['build:browser'], () => {
  b.copy('app/index.html', 'dist/app/')
  b.copy('app/main.js', 'dist/app/')
  b.copy('app/package.json.in', 'dist/app/package.json')
  b.css('app/editor.css', 'dist/app/editor.css', { variables: true })
  b.js('app/editor.js', {
    target: {
      dest: 'dist/app/editor.js',
      format: 'umd',
      moduleName: 'editor'
    },
    external: ['substance', 'texture'],
    globals: {
      'substance': 'window.substance',
      'texture': 'window.texture'
    }
  })
})

b.task('test:assets', () => {
  vfs(b, {
    src: ['./test/fixture/**/*.xml'],
    dest: './tmp/test-vfs.js',
    format: 'es', moduleName: 'vfs'
  })
})

b.task('test:browser', ['build:browser', 'test:assets'], () => {
  b.copy('test/index.html', 'dist/test/index.html')
  b.copy('node_modules/substance-test/dist/testsuite.js', 'dist/test/testsuite.js')
  b.copy('node_modules/substance-test/dist/test.css', 'dist/test/test.css')
  b.js('test/**/*.test.js', {
    dest: 'dist/test/tests.js',
    format: 'umd', moduleName: 'tests',
    external: {
      'substance': 'window.substance',
      'substance-test': 'window.substanceTest',
      'substance-texture': 'window.texture'
    }
  })
})
.describe('builds the test-suite for the browser (open test/index.html)')

b.task('test:node', ['build:nodejs', 'test:assets'], () => {
  b.js('test/**/*.test.js', {
    dest: 'tmp/tests.cjs.js',
    format: 'cjs',
    external: ['substance-test', 'substance', 'substance-texture'],
    // do not require substance-texture from 'node_modules' but from the dist folder
    paths: {
      'substance-texture': '../dist/texture.cjs.js'
    }
  })
  fork(b, require.resolve('substance-test/bin/test'), './tmp/tests.cjs.js', { verbose: true })
})
.describe('runs the test suite in nodejs')

b.task('examples', () => {
  vfs(b, {
    src: ['./data/**/*'],
    dest: DIST+'/vfs.js',
    format: 'umd', moduleName: 'vfs'
  })
  b.copy('./examples/*.html', DIST)
  b.js('./examples/editor.js', {
    targets: [{
      dest: DIST+'editor.js',
      format: 'umd',
      moduleName: 'textureEditor',
      globals: {
        'substance': 'window.substance',
        'substance-texture': 'window.texture'
      }
    }],
    external: ['substance', 'substance-texture']
  })
})

// default build: creates a dist folder with a production bundle
b.task('default', ['clean', 'assets', 'build:browser', 'examples'])

b.task('dev', ['default'])

b.task('publish', ['clean', 'assets', 'compile:schema'], () => {
  _buildLib(DIST, 'all')
})

b.task('test', ['test:node'])

b.task('app', ['build:app'])

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
      b.writeFileSync(DEST, `export default ${JSON.stringify(xmlSchema)}`)
      b.writeFileSync(SCHEMA, xmlSchema.toMD())
      if (options.debug) {
        const issues = checkSchema(xmlSchema)
        const issuesData = [`${issues.length} issues:`, ''].concat(issues).join('\n')
        b.writeFileSync(ISSUES, issuesData)
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
        b.writeFileSync(DEST, xml)
      }
    })
  })
}

/* Server */

b.setServerPort(4000)
b.serve({ static: true, route: '/', folder: './dist' })
