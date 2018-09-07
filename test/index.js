import { platform } from 'substance'
import './testGlobals'
// tests
import './ArticlePanel.test'
import './AddReference.test'
import './FindAndReplace.test'
import './ManuscriptEditor.test'
import './Persistence.test'
import './TableComponent.test'
import './TableConverter.test'
import './BodyConverter.test'

platform.test = true
