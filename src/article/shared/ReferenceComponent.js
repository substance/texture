import { NodeComponent } from '../../kit'
import { PREVIEW_MODE, METADATA_MODE } from '../ArticleConstants'
import { getLabel } from './nodeHelpers'
import PreviewComponent from './PreviewComponent'
import DefaultNodeComponent from './DefaultNodeComponent'
import InplaceRefContribsEditor from '../metadata/InplaceRefContribsEditor'

export default class ReferenceComponent extends NodeComponent {
  render ($$) {
    let mode = this.props.mode
    let node = this.props.node
    let label = this._getReferenceLabel()
    let html = this.context.api.renderEntity(node)
    // TODO: use the label provider
    html = html || '<i>Not available</i>'
    if (mode === PREVIEW_MODE) {
      // NOTE: We return PreviewComponent directly, to prevent inheriting styles from .sc-reference
      return $$(PreviewComponent, {
        id: node.id,
        label,
        description: $$('div').html(html)
      })
    } else if (mode === METADATA_MODE) {
      return $$(ReferenceMetadataComponent, { node })
    } else {
      let el = $$('div').addClass('sc-reference')
      el.append(
        $$('div').addClass('se-label').append(label),
        $$('div').addClass('se-text').html(html)
      ).attr('data-id', node.id)
      return el
    }
  }

  _getReferenceLabel () {
    return getLabel(this.props.node) || '?'
  }
}

class ReferenceMetadataComponent extends DefaultNodeComponent {
  _getClassNames () {
    return 'sc-reference sm-metadata'
  }
  // using a special inplace property editor for 'ref-contrib's
  _getPropertyEditorClass (name, value) {
    if (value.hasTargetType('ref-contrib')) {
      return InplaceRefContribsEditor
    } else {
      return super._getPropertyEditorClass(name, value)
    }
  }
}
