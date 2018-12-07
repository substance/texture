import FigureMetadataComponent from './FigureMetadataComponent'
import FootnoteEditor from './FootnoteEditor'
import LicenseEditor from './LicenseEditor'

export default class TableFigureMetadataComponent extends FigureMetadataComponent {
  _getClassNames () {
    return `sc-table-figure-metadata sc-node-model`
  }

  _getPropertyEditorClass (property) {
    // skip 'label' here, as it is shown 'read-only' in the header instead
    if (property.name === 'label') {
      return null
    // special editor to pick license type
    } else if (property.name === 'license') {
      return LicenseEditor
    } else if (property.name === 'footnotes') {
      return FootnoteEditor
    } else {
      return super._getPropertyEditorClass(property)
    }
  }
}
