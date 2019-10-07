import { $$ } from 'substance'
import { createNodePropertyModels } from '../../kit'
import { getLabel } from '../shared/nodeHelpers'
import DefaultNodeComponent from './DefaultNodeComponent'
import LicenseEditor from './LicenseEditor'
import FigureMetadataComponent from './FigureMetadataComponent'

export default class FigurePanelComponentWithMetadata extends DefaultNodeComponent {
  _getClassNames () {
    return `sc-figure-metadata sc-default-node`
  }

  _renderHeader () {
    const node = this.props.node
    let header = $$('div').addClass('se-header')
    header.append(
      $$('div').addClass('se-label').text(getLabel(node))
    )
    return header
  }

  // overriding this to get spawn a special editor for the content
  _getPropertyEditorClass (name, value) {
    // skip 'label' here, as it is shown 'read-only' in the header instead
    if (name === 'label') {
      return null
    // special editor to pick license type
    } else if (name === 'license') {
      return LicenseEditor
    } else if (name === 'metadata') {
      return FigureMetadataComponent
    } else {
      return super._getPropertyEditorClass(name, value)
    }
  }

  _createPropertyModels () {
    const api = this.context.api
    const node = this.props.node
    const doc = node.getDocument()
    // ATTENTION: we want to show permission properties like they were fields of the panel itself
    // for that reason we are creating a property map where the permission fields are merged in
    return createNodePropertyModels(api, this.props.node, {
      // EXPERIMENTAL: trying to allow
      'permission': () => {
        let permission = doc.get(node.permission)
        return createNodePropertyModels(api, permission)
      }
    })
  }

  _showLabelForProperty (prop) {
    // Don't render a label for content property to use up the full width
    if (prop === 'content') {
      return false
    }
    return true
  }
}
