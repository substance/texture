import { platform, substanceGlobals } from 'substance'
import './shared/testGlobals'
// tests
import './Annotations.test'
import './ArticlePanel.test'
import './BodyConverter.test'
import './Card.test'
import './ClipboardNew.test'
import './CrossReference.test'
import './CustomMetadataField.test'
import './Entity.test'
import './Figure.test'
import './FindAndReplace.test'
import './Footnotes.test'
import './FormulaConverter.test'
import './Input.test'
import './JATSImporter.test'
import './LabelGenerator.test'
import './ManuscriptEditor.test'
import './MetadataEditor.test'
import './Paste.test'
import './Persistence.test'
import './PreformatConverter.test'
import './Reference.test'
import './Table.test'
import './TableConverter.test'
import './SupplementaryFile.test'

// TODO: there are some tests in ./converter/. Either fix them and include here
// or remove them

platform.test = true

if (platform.devtools) {
  substanceGlobals.DEBUG_RENDERING = true
}

if (platform.inNodeJS) {
  substanceGlobals.DEBUG_RENDERING = false

  if (process.env.TEST) {
    const { test } = require('substance-test')
    let harness = test.getHarness()
    let re = new RegExp(process.env.TEST)
    harness._tests.forEach(t => {
      if (!re.exec(t.name)) {
        t._skip = true
      }
    })
  }
}
