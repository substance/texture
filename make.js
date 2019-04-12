/* eslint-disable no-template-curly-in-string */
const b = require('substance-bundler')
const fs = require('fs')
const path = require('path')
const fork = require('substance-bundler/extensions/fork')
const vfs = require('substance-bundler/extensions/vfs')
const yazl = require('yazl')

const DIST = 'dist/'
const APPDIST = 'app-dist/'
const TMP = 'tmp/'
// const RNG_SEARCH_DIRS = [
//   path.join(__dirname, 'src', 'article')
// ]
// const JATS = 'JATS-archiving'
// const RNG_FILES = [
//   `src/article/${JATS}.rng`,
//   'src/article/TextureJATS.rng'
// ]

// Server configuration
let port = process.env['PORT'] || 4000
b.setServerPort(port)
b.yargs.option('d', {
  type: 'string',
  alias: 'rootDir',
  describe: 'Root directory of served archives'
})
let argv = b.yargs.argv
if (argv.d) {
  const serve = require('./src/dar/serve')
  const rootDir = argv.d
  const archiveDir = path.resolve(path.join(__dirname, rootDir))
  serve(b.server, {
    port,
    serverUrl: 'http://localhost:' + port,
    rootDir: archiveDir,
    apiUrl: '/archives'
  })
}
b.serve({ static: true, route: '/', folder: './dist' })

// Make Targets

b.task('clean', function () {
  b.rm(DIST)
  b.rm(TMP)
  b.rm(APPDIST)
}).describe('removes all generated files and folders.')

b.task('lib', ['clean', 'build:schema', 'build:assets', 'build:lib'])
  .describe('builds the library bundle.')

b.task('browser', ['clean', 'build:schema', 'build:assets', 'build:browser'])
  .describe('builds the browser bundle.')

b.task('publish', ['clean', 'build:schema', 'build:assets', 'build:lib', 'build:web'])
  .describe('builds the release bundle (library + web).')

b.task('web', ['clean', 'build:schema', 'build:assets', 'build:browser', 'build:web'])
  .describe('builds the web bundle (browser + web).')

b.task('app', ['clean', 'build:schema', 'build:assets', 'build:browser', 'build:app'])
  .describe('builds the app bundle (electron app).')

b.task('test-nodejs', ['clean', 'build:schema', 'build:test-assets'])
  .describe('prepares everything necessary to run tests in node.')

b.task('test-browser', ['clean', 'build:schema', 'build:browser', 'build:test-assets', 'build:test-browser'])
  .describe('builds the test-suite for the browser.')

// an alias because in all our other projects it is named this way
b.task('test:browser', ['test-browser'])

b.task('default', ['publish'])
  .describe('default: publish')

// spawns electron after build is ready
b.task('run-app', ['app'], () => {
  // Note: `await=false` is important, as otherwise bundler would await this to finish
  fork(b, require.resolve('electron/cli.js'), '.', { verbose: true, cwd: APPDIST, await: false })
})
  .describe('runs the application in electron.')

// low-level make targets

b.task('schema:texture-article', () => {
  // TODO: bring this back after factoring out xml utilities and prebuilt JATS schemas
  // _compileSchema('TextureJATS', RNG_FILES[1], RNG_SEARCH_DIRS, RNG_FILES.slice(0, 2))
  // b.custom(`Copy schema documentation...`, {
  //   src: './tmp/TextureJATS.schema.md',
  //   dest: './docs/TextureJATS.md',
  //   execute () {
  //     b.copy('./tmp/TextureJATS.schema.md', './docs/TextureJATS.md')
  //   }
  // })
})

b.task('schema:debug', () => {
  // _compileSchema('TextureJATS', RNG_FILES[1], RNG_SEARCH_DIRS, RNG_FILES.slice(0, 2), { debug: true })
})

b.task('build:assets', function () {
  b.copy('./node_modules/font-awesome', DIST + 'font-awesome')
  b.copy('./node_modules/inter-ui', DIST + 'inter-ui')
  b.copy('./node_modules/katex/dist', DIST + 'katex')
  b.copy('./node_modules/substance/dist', DIST + 'substance/dist')
  b.css('texture.css', DIST + 'texture.css')
  b.css('texture-reset.css', DIST + 'texture-reset.css')
})

b.task('build:schema', ['schema:texture-article'])

b.task('build:browser', () => {
  _buildLib(DIST, 'browser')
})

b.task('build:nodejs', () => {
  _buildLib(DIST, 'nodejs')
})

b.task('build:lib', () => {
  _buildLib(DIST, 'all')
})

b.task('build:cover', () => {
  _buildLib(TMP, 'cover')
})

b.task('build:app', ['build:app:dars'], () => {
  b.copy('app/index.html', APPDIST)
  b.copy('app/build-resources', APPDIST)
  // FIXME: this command leads to an extra run when a  file is updated
  // .. instead copying the files explicitly for now
  // b.copy('dist', APPDIST+'lib/')
  b.copy('dist/font-awesome', APPDIST + 'lib/')
  b.copy('dist/katex', APPDIST + 'lib/')
  b.copy('dist/inter-ui', APPDIST + 'lib/')
  b.copy('dist/substance', APPDIST + 'lib/')
  ;[
    'texture.js',
    'texture.css',
    'texture-reset.css'
  ].forEach(f => {
    b.copy(`dist/${f}`, APPDIST + 'lib/')
    b.copy(`dist/${f}.map`, APPDIST + 'lib/')
  })

  // TODO: maybe we could come up with an extension
  // that expands a source file using a given dict.
  b.custom('Creating application package.json...', {
    src: 'app/package.json.in',
    dest: APPDIST + 'package.json',
    execute () {
      let { version, dependencies, devDependencies } = require('./package.json')
      let tpl = fs.readFileSync('app/package.json.in', 'utf8')
      let out = tpl.replace('${version}', version)
        .replace('${electronVersion}', devDependencies.electron)
        .replace('${dependencies}', JSON.stringify(dependencies))
      fs.writeFileSync(APPDIST + 'package.json', out)
    }
  })
  b.js('app/main.js', {
    output: [{
      file: APPDIST + 'main.js',
      format: 'cjs'
    }],
    external: ['electron', 'path', 'url']
  })
  b.js('app/app.js', {
    output: [{
      file: APPDIST + 'app.js',
      format: 'umd',
      name: 'textureApp',
      globals: {
        'substance': 'substance',
        'substance-texture': 'texture',
        'katex': 'katex'
      }
    }],
    external: [ 'substance', 'substance-texture', 'katex' ]
  })
  // execute 'install-app-deps'
  fork(b, require.resolve('electron-builder/out/cli/cli.js'), 'install-app-deps', { verbose: true, cwd: APPDIST, await: true })
})

b.task('build:app:dars', () => {
  // templates
  _packDar('data/blank', APPDIST + 'templates/blank.dar')
  _packDar('data/blank-figure-package', APPDIST + 'templates/blank-figure-package.dar')
  // examples
  _packDar('data/elife-32671', APPDIST + 'examples/elife-32671.dar')
  _packDar('data/kitchen-sink', APPDIST + 'examples/kitchen-sink.dar')
})

b.task('build:vfs', () => {
  vfs(b, {
    src: ['./data/**/*'],
    dest: DIST + 'vfs.js',
    format: 'umd',
    moduleName: 'vfs',
    rootDir: path.join(__dirname, 'data')
  })
})

b.task('_copy-data-folder', () => {
  b.copy('./data', DIST + 'data')
})

b.task('build:web', ['build:vfs', '_copy-data-folder'], () => {
  b.copy('web/index.html', DIST)
  b.js('./web/editor.js', {
    output: [{
      file: DIST + 'editor.js',
      format: 'umd',
      name: 'textureEditor',
      globals: {
        'substance': 'substance',
        'substance-texture': 'texture',
        'katex': 'katex'
      }
    }],
    external: ['substance', 'substance-texture', 'katex']
  })
})

b.task('build:test-assets', ['build:vfs', '_copy-data-folder', 'build:app:dars'], () => {
  vfs(b, {
    src: ['./test/fixture/**/*.xml'],
    dest: DIST + 'test/test-vfs.js',
    format: 'umd',
    moduleName: 'TEST_VFS',
    rootDir: path.join(__dirname, 'test', 'fixture')
  })
})

b.task('build:test-browser', ['build:assets', 'build:test-assets'], () => {
  b.copy('test/index.html', 'dist/test/index.html')
  b.copy('test/_test.css', 'dist/test/_test.css')
  b.copy('node_modules/substance-test/dist/testsuite.js', 'dist/test/testsuite.js')
  b.copy('node_modules/substance-test/dist/test.css', 'dist/test/test.css')

  // NOTE: by declaring texture/index.js as external we manage to serve both environments, browser and nodejs
  // with the same code.
  // In the browser, texture is used via the regular texture bundle, in nodejs it is resolved in the regular way
  const INDEX_JS = path.join(__dirname, 'index.js')
  const TEST_VFS = path.join(__dirname, 'tmp', 'test-vfs.js')
  let globals = {
    'substance': 'substance',
    'substance-test': 'substanceTest',
    'katex': 'katex',
    // TODO: this should be done in the same way as INDEX_JS and TEST_VFS
    'vfs': 'vfs'
  }
  globals[INDEX_JS] = 'texture'
  globals[TEST_VFS] = 'testVfs'

  b.js('test/index.js', {
    output: [{
      file: 'dist/test/tests.js',
      format: 'umd',
      name: 'tests',
      globals
    }],
    external: [
      'substance',
      'substance-test',
      INDEX_JS,
      'katex',
      'vfs',
      TEST_VFS
    ]
  })
})

/* HELPERS */

function _buildLib (DEST, platform) {
  let targets = []
  let istanbul
  if (platform === 'browser' || platform === 'all') {
    targets.push({
      file: DEST + 'texture.js',
      format: 'umd',
      name: 'texture',
      sourcemapRoot: __dirname,
      sourcemapPrefix: 'texture',
      globals: {
        'substance': 'substance',
        'katex': 'katex',
        'vfs': 'vfs'
      }
    })
  }
  if (platform === 'nodejs' || platform === 'all') {
    targets.push({
      file: DEST + 'texture.cjs.js',
      format: 'cjs'
    })
  }
  if (platform === 'es' || platform === 'all') {
    targets.push({
      file: DEST + 'texture.es.js',
      format: 'es'
    })
  }
  b.js('./index.js', {
    output: targets,
    external: ['substance', 'katex', 'vfs'],
    istanbul
  })
}

function _packDar (dataFolder, darPath) {
  b.custom(`Creating ${darPath}...`, {
    src: dataFolder + '/**/*',
    dest: darPath,
    execute (files) {
      return new Promise((resolve, reject) => {
        let zipfile = new yazl.ZipFile()
        for (let f of files) {
          let relPath = path.relative(dataFolder, f)
          zipfile.addFile(f, relPath)
        }
        zipfile.outputStream.pipe(fs.createWriteStream(darPath))
          .on('close', (err) => {
            if (err) {
              console.error(err)
              reject(err)
            } else {
              resolve()
            }
          })
        zipfile.end()
      })
    }
  })
}
