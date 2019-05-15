/* eslint-disable no-template-curly-in-string */
const b = require('substance-bundler')
const fs = require('fs')
const path = require('path')
const fork = require('substance-bundler/extensions/fork')
const vfs = require('substance-bundler/extensions/vfs')
const rollup = require('substance-bundler/extensions/rollup')
const yazl = require('yazl')
const compileSchema = require('texture-xml-utils/bundler/compileSchema')
const generateSchemaDocumentation = require('texture-xml-utils/bundler/generateSchemaDocumentation')
const commonjs = require('rollup-plugin-commonjs')
const nodeResolve = require('rollup-plugin-node-resolve')

const DIST = 'dist/'
const APPDIST = 'app-dist/'
const TMP = 'tmp/'

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

b.task('default', ['dev'])

b.task('clean', function () {
  b.rm(DIST)
  b.rm(TMP)
  b.rm(APPDIST)
}).describe('removes all generated files and folders.')

b.task('publish', ['clean', 'build:schema', 'build:assets', 'build:lib', 'build:demo'])
  .describe('builds the release bundle (library + web).')

b.task('lib', ['clean', 'build:schema', 'build:assets', 'build:lib'])
  .describe('builds the library bundle.')

b.task('dev', ['clean', 'build:schema', 'build:assets', 'build:demo'])
  .describe('builds the web bundle.')

b.task('desktop', ['clean', 'build:schema', 'build:assets', 'build:lib:browser', 'build:desktop'])
  .describe('builds the desktop bundle (electron).')

b.task('test-nodejs', ['clean', 'build:schema', 'build:test-assets'])
  .describe('prepares everything necessary to run tests in node.')

b.task('test-browser', ['clean', 'build:schema', 'build:lib:browser', 'build:test-assets', 'build:test-browser'])
  .describe('builds the test-suite for the browser.')

// an alias because in all our other projects it is named this way
b.task('test:browser', ['test-browser'])

// spawns electron after build is ready
b.task('run-app', ['desktop'], () => {
  // Note: `await=false` is important, as otherwise bundler would await this to finish
  fork(b, require.resolve('electron/cli.js'), '.', { verbose: true, cwd: APPDIST, await: false })
}).describe('runs the application in electron.')

b.task('schema:texture-article', () => {
  let rngFile = path.join(__dirname, 'src', 'article', 'TextureJATS.rng')
  compileSchema(b, rngFile, {
    dest: TMP + 'TextureJATS.data.js',
    searchDirs: [
      path.join(__dirname, 'node_modules', 'texture-plugin-jats', 'rng')
    ]
  })
  generateSchemaDocumentation(b, rngFile, {
    dest: 'docs/TextureJATS.md',
    searchDirs: [
      path.join(__dirname, 'node_modules', 'texture-plugin-jats', 'rng')
    ],
    headingLevelOffset: 1,
    ammend (md) {
      return [
        '# Texture Article',
        '',
        'This schema defines a strict sub-set of JATS Archiving 1.2.',
        '',
        md
      ].join('\n')
    }
  })
})

b.task('build:assets', function () {
  b.copy('./node_modules/font-awesome', DIST + 'lib/font-awesome')
  b.copy('./node_modules/inter-ui', DIST + 'lib/inter-ui')
  b.copy('./node_modules/katex/dist', DIST + 'lib/katex')
  b.copy('./node_modules/substance/dist/*.css*', DIST + 'lib/substance/')
  b.copy('./node_modules/substance/dist/substance.min.js*', DIST + 'lib/substance/')
  b.copy('./node_modules/texture-plugin-jats/dist', DIST + 'plugins/texture-plugin-jats')
  b.css('texture.css', DIST + 'texture.css')
  b.css('texture-reset.css', DIST + 'texture-reset.css')
})

b.task('build:schema', ['schema:texture-article'])

b.task('build:lib:browser', () => {
  _buildLib(DIST, 'browser')
})

b.task('build:lib:nodejs', () => {
  _buildLib(DIST, 'nodejs')
})

b.task('build:lib', () => {
  _buildLib(DIST, 'all')
})

b.task('build:desktop', ['build:desktop:dars'], () => {
  b.copy('builds/desktop/index.html', APPDIST)
  b.copy('builds/desktop/build-resources', APPDIST)
  // FIXME: this command leads to an extra run when a  file is updated
  // .. instead copying the files explicitly for now
  // b.copy('dist', APPDIST+'lib/')
  b.copy('./node_modules/font-awesome', APPDIST + 'lib/')
  b.copy('./node_modules/katex/dist', APPDIST + 'lib/katex')
  b.copy('./node_modules/inter-ui', APPDIST + 'lib/')
  b.copy('./node_modules/substance/dist/*.css*', APPDIST + 'lib/substance/')
  b.copy('./node_modules/substance/dist/substance.min.js*', APPDIST + 'lib/substance/')
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
    src: 'builds/desktop/package.json.in',
    dest: APPDIST + 'package.json',
    execute () {
      let { version, dependencies, devDependencies } = require('./package.json')
      let tpl = fs.readFileSync('builds/desktop/package.json.in', 'utf8')
      let out = tpl.replace('${version}', version)
        .replace('${electronVersion}', devDependencies.electron)
        .replace('${dependencies}', JSON.stringify(dependencies))
      fs.writeFileSync(APPDIST + 'package.json', out)
    }
  })
  rollup(b, {
    input: 'builds/desktop/main.js',
    output: {
      file: APPDIST + 'main.js',
      format: 'cjs'
    },
    external: ['electron', 'path', 'url'],
    plugins: [
      nodeResolve(),
      commonjs({
        include: 'node_modules/**'
      })
    ]
  })
  rollup(b, {
    input: 'builds/desktop/app.js',
    output: {
      file: APPDIST + 'app.js',
      format: 'umd',
      name: 'textureApp',
      globals: {
        'substance': 'substance',
        'substance-texture': 'texture',
        'katex': 'katex'
      }
    },
    external: [ 'substance', 'substance-texture', 'katex' ],
    plugins: [
      nodeResolve(),
      commonjs({
        include: 'node_modules/**'
      })
    ]
  })
  // execute 'install-app-deps'
  fork(b, require.resolve('electron-builder/out/cli/cli.js'), 'install-app-deps', { verbose: true, cwd: APPDIST, await: true })
})

b.task('build:desktop:dars', () => {
  // templates
  _packDar('data/blank', APPDIST + 'templates/blank.dar')
  _packDar('data/blank-figure-package', APPDIST + 'templates/blank-figure-package.dar')
  // examples
  _packDar('data/elife-32671', APPDIST + 'examples/elife-32671.dar')
  _packDar('data/kitchen-sink', APPDIST + 'examples/kitchen-sink.dar')
})

b.task('build:demo:vfs', () => {
  b.copy('data', DIST + 'demo/data')
  vfs(b, {
    src: ['./data/**/*'],
    dest: DIST + 'demo/vfs.js',
    format: 'umd',
    moduleName: 'vfs',
    rootDir: path.join(__dirname, 'data')
  })
})

b.task('build:demo', ['build:demo:vfs', 'build:lib:browser'], () => {
  b.copy('builds/demo/index.html', DIST)
  rollup(b, {
    input: 'builds/demo/demo.js',
    external: ['substance', 'substance-texture', 'katex'],
    output: {
      file: DIST + 'demo/demo.js',
      format: 'umd',
      name: 'TextureDemo',
      globals: {
        'substance': 'substance',
        'substance-texture': 'texture',
        'katex': 'katex'
      }
    }
  })
})

b.task('build:test-assets', ['build:demo:vfs', 'build:desktop:dars'], () => {
  vfs(b, {
    src: ['./test/fixture/**/*.xml'],
    dest: DIST + 'test/test-vfs.js',
    format: 'umd',
    moduleName: 'TEST_VFS',
    rootDir: path.join(__dirname, 'test', 'fixture')
  })
  // copy a non-minified substance file into test folder
  b.copy('./node_modules/substance/dist/substance.js*', DIST + 'test/')
  // NOTE: to be compatible with nodejs test we need to copy the whole path into dist/test/
  b.copy('./test/fixture', DIST + 'test/test/')
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

  rollup(b, {
    input: 'test/index.js',
    external: [
      'substance',
      'substance-test',
      INDEX_JS,
      'katex',
      'vfs',
      TEST_VFS
    ],
    plugins: [
      nodeResolve(),
      commonjs({
        include: 'node_modules/**'
      })
    ],
    output: {
      file: 'dist/test/tests.js',
      format: 'umd',
      name: 'tests',
      globals
    }
  })
})

/* HELPERS */

function _buildLib (DEST, platform) {
  let output = []
  if (platform === 'browser' || platform === 'all') {
    output.push({
      file: DEST + 'texture.js',
      format: 'umd',
      name: 'texture',
      globals: {
        'substance': 'substance',
        'katex': 'katex',
        'vfs': 'vfs'
      }
    })
  }
  if (platform === 'nodejs' || platform === 'all') {
    output.push({
      file: DEST + 'texture.cjs.js',
      format: 'cjs'
    })
  }
  if (platform === 'es' || platform === 'all') {
    output.push({
      file: DEST + 'texture.es.js',
      format: 'esm'
    })
  }
  rollup(b, {
    input: './index.js',
    external: ['substance', 'katex', 'vfs'],
    output,
    plugins: [
      nodeResolve(),
      commonjs({
        include: 'node_modules/**'
      })
    ]
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
