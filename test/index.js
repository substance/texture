import { platform } from 'substance'
import './shared/testGlobals'
// tests
import './ArticlePanel.test'
import './Annotations.test'
import './AddReference.test'
import './Card.test'
import './Citations.test'
import './ClipboardNew.test'
import './FormulaConverter.test'
import './FindAndReplace.test'
import './Input.test'
import './InsertIsolatedNode.test'
import './JATSImporter.test'
import './Model.test'
import './ManuscriptEditor.test'
import './MetadataEditor.test'
import './Paste.test'
import './Persistence.test'
import './Table.test'
import './TableConverter.test'
import './BodyConverter.test'

platform.test = true

if (platform.inNodeJS) {
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
