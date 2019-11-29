import { FontAwesomeIcon } from 'substance'
import { NodeComponent } from '../../kit'
import { PREVIEW_MODE, METADATA_MODE } from '../ArticleConstants'
import { getLabel } from '../shared/nodeHelpers'
import PreviewComponent from './PreviewComponent'
import DefaultNodeComponent from './DefaultNodeComponent'
import InplaceRefContribsEditor from '../metadata/InplaceRefContribsEditor'
import { createNodePropertyModels, createValueModel } from '../../kit'
import SpecificUseEditor from '../components/SpecificUseEditor'

export default class ReferenceComponent extends NodeComponent {
  render ($$) {
    let mode = this.props.mode
    let node = this.props.node
    let label = this._getReferenceLabel()
    let html = this.context.api.renderEntity(node)
    // TODO: use the label provider
    html = html || '<i>Not available</i>'

    if (mode === PREVIEW_MODE)
    {
      // NOTE: We return PreviewComponent directly, to prevent inheriting styles from .sc-reference
      return $$(PreviewComponent, {
        id: node.id,
        description: $$('div').html(html)
      })
    }
    else if (mode === METADATA_MODE)
    {
      return $$(ReferenceMetadataComponent, { node })
    }
    else
    {
      let el = $$('div').addClass('sc-reference')
      el.append(
        $$('div').addClass('se-label').append('\u2022'),
        $$('div').addClass('se-text').html(html),
        $$(FontAwesomeIcon, { icon: 'fa-edit' }).addClass('se-icon'),
        $$(FontAwesomeIcon, { icon: 'fa-trash' }).addClass('se-icon')
      ).attr('data-id', node.id)
      return el
    }
  }

  _getReferenceLabel () {
    return getLabel(this.props.node) || '?';
  }
}

class ReferenceMetadataComponent extends DefaultNodeComponent {
  _getClassNames () {
    return 'sc-reference sm-metadata'
  }

  _createPropertyModels ()
  {
    const api = this.context.api
    const node = this.props.node
    const doc = node.getDocument()
    return createNodePropertyModels(api, this.props.node, (p) => {
      switch (p.name) {
        case 'stringDate': {
          let stringDate = doc.get(node.stringDate)
          return createNodePropertyModels(api, stringDate)
        }
        default:
          return createValueModel(api, [node.id, p.name], p);
      }
    })
  }

  // using a special inplace property editor for 'ref-contrib's
  _getPropertyEditorClass (name, value)
  {
    if (value.hasTargetType('ref-contrib'))
    {
      return InplaceRefContribsEditor
    }
    else
    {
      switch (name)
      {
        case 'specificUse':
          return SpecificUseEditor;

        default:
          return super._getPropertyEditorClass(name, value)
      }
    }
  }
}
