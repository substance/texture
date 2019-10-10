import { platform, substanceGlobals } from 'substance'
import './shared/testGlobals'

// Tests
import './Annotations.test'
import './Archive.test'
import './BodyConverter.test'
import './Configurator.test'
import './CrossReference.test'
import './CustomAbstracts.test'
import './Entity.test'
import './Figure.test'
import './FindAndReplace.test'
import './Footnotes.test'
import './FormulaConverter.test'
import './Input.test'
import './JATSImporter.test'
import './LabelGenerator.test'
import './ManuscriptEditor.test'
import './Paste.test'
import './Persistence.test'
import './PreformatConverter.test'
import './Reference.test'
import './Settings.test'
import './SupplementaryFile.test'
import './Table.test'
import './TableConverter.test'
import './UndoRedo.test'
import './Validator.test'

// TODO: there are some tests in ./converter/. Either fix them and include here
// or remove them

// stopping after loading tests if running for debug
if (typeof process !== 'undefined' && process.execArgv && process.execArgv.find(p => p.startsWith('--inspect'))) {
  debugger // eslint-disable-line
}

platform.test = true

if (platform.inBrowser) {
  substanceGlobals.DEBUG_RENDERING = true
}

if (platform.inNodeJS) {
  // load JATS plugin to enable validators
  require('texture-plugin-jats')

  // TODO: why do we force this?
  substanceGlobals.DEBUG_RENDERING = false

  // pure NodeJS tests (i.e. parts used in electron app)
  require('./Storage.test.js')

  if (process.env.DEBUG) {
    platform.DEBUG = true
  }

  // this allows to run only a subset of tests
  if (process.env.TEST) {
    const { test } = require('substance-test')
    let harness = test.getHarness()
    let re = new RegExp(process.env.TEST)
    // TODO: it would be nice to remove the other tests
    // because skipped tests still produce a lot of noise
    harness._tests.forEach(t => {
      if (!re.exec(t.name)) {
        t._skip = true
      }
    })
  }
}
