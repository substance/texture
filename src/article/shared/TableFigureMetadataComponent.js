import FigureMetadataComponent from './FigureMetadataComponent'
import FootnoteEditor from './FootnoteEditor'
import LicenseEditor from './LicenseEditor'

export default class TableFigureMetadataComponent extends FigureMetadataComponent {
  _getClassNames () {
    return `sc-table-figure-metadata`
  }

  _getPropertyEditorClass (name, value) {
    // skip 'label' here, as it is shown 'read-only' in the header instead
    if (name === 'label') {
      return null
    // special editor to pick license type
    } else if (name === 'license') {
      return LicenseEditor
    } else if (name === 'footnotes') {
      return FootnoteEditor
    } else {
      return super._getPropertyEditorClass(name, value)
    }
  }
}
