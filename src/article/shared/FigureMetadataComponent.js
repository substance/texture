import NodeModelComponent from './NodeModelComponent'
import LicenseEditor from './LicenseEditor'

export default class FigureMetadataComponent extends NodeModelComponent {
  _getClassNames () {
    return `sc-figure-metadata sc-node-model`
  }

  _renderHeader ($$) {
    const model = this.props.model
    let header = $$('div').addClass('se-header')
    header.append(
      $$('div').addClass('se-label').text(model.getLabel())
    )
    return header
  }

  // overriding this to get spawn a special editor for the content
  _getPropertyEditorClass (property) {
    // skip 'label' here, as it is shown 'read-only' in the header instead
    if (property.name === 'label') {
      return null
    // special editor to pick license type
    } else if (property.name === 'license') {
      return LicenseEditor
    } else {
      return super._getPropertyEditorClass(property)
    }
  }
}
