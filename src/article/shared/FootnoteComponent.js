import { NodeComponent } from '../../kit'
import { getLabel } from './nodeHelpers'
import { PREVIEW_MODE } from '../ArticleConstants'
import PreviewComponent from './PreviewComponent'

export default class FootnoteComponent extends NodeComponent {
  render ($$) {
    const node = this.props.node
    const mode = this.props.mode
    const model = this.props.model
    const Container = this.getComponent('container')

    let el = $$('div')
      .addClass('sc-footnote')
      .attr('data-id', node.id)

    let label = getLabel(node) || '?'

    if (mode === PREVIEW_MODE) {
      el.append(
        $$(PreviewComponent, {
          id: model.id,
          label: label,
          description: $$(Container, {
            node: node,
            disabled: true,
            editable: false
          })
        })
      )
    } else {
      let fnContainer = $$('div').addClass('se-container')
      el.append(
        fnContainer.append(
          $$('div').addClass('se-label').append(
            label
          ),
          $$(Container, {
            placeholder: 'Enter Footnote',
            node: node,
            disabled: this.props.disabled
          }).ref('editor')
        )
      )
    }
    return el
  }
}
