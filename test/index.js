import { platform, substanceGlobals } from 'substance'
import './shared/testGlobals'
// tests
import './AddEntity.test'
import './ArticlePanel.test'
import './Annotations.test'
import './AddReference.test'
import './BodyConverter.test'
import './Card.test'
import './ClipboardNew.test'
import './CrossReference.test'
import './EditReference.test'
import './Footnote.test'
import './FormulaConverter.test'
import './FindAndReplace.test'
import './Input.test'
import './InsertIsolatedNode.test'
import './JATSImporter.test'
import './LabelGenerator.test'
import './Model.test'
import './ManuscriptEditor.test'
import './MetadataEditor.test'
import './Paste.test'
import './Persistence.test'
import './Table.test'
import './TableConverter.test'

platform.test = true

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
