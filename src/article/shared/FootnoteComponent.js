import { Component } from 'substance'
import { getLabel } from './nodeHelpers'
import { PREVIEW_MODE } from '../ArticleConstants'
import PreviewComponent from './PreviewComponent'

export default class FootnoteComponent extends Component {
  render ($$) {
    const node = this.props.node
    let el = $$('div')
      .addClass('sc-fn-item')
      .attr('data-id', node.id)

    let label = getLabel(node) || '?'

    let contentEl = $$(this.getComponent('container'), {
      placeholder: 'Enter Footnote',
      node: node,
      disabled: this.props.disabled
    }).ref('editor')

    if (this.props.mode === PREVIEW_MODE) {
      el.append(
        $$(PreviewComponent, {
          id: this.props.model.id,
          label: label,
          description: contentEl
        })
      )
    } else {
      let fnContainer = $$('div').addClass('se-fn-container')
      el.append(
        fnContainer.append(
          $$('div').addClass('se-label').append(
            label
          ),
          contentEl
        )
      )
    }
    return el
  }
}
