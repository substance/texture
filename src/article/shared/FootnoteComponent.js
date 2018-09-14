import { Component } from 'substance'
import { getLabel } from './nodeHelpers'
import { METADATA_MODE, PREVIEW_MODE } from '../ArticleConstants'
import PreviewComponent from './PreviewComponent'

export default class FootnoteComponent extends Component {
  render ($$) {
    const node = this.props.node
    const mode = this.props.mode
    const model = this.props.model
    const Container = this.getComponent('container')

    let el = $$('div')
      .addClass('sc-fn-item')
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
      let fnContainer = $$('div').addClass('se-fn-container')
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

    if (mode === METADATA_MODE) {
      const Button = this.getComponent('button')
      const footer = $$('div').addClass('se-footer').append(
        $$(Button, {label: 'remove', icon: 'remove'}).addClass('se-remove-item')
          .on('click', this._removeFootnote)
      )
      el.append(footer)
    }
    return el
  }

  _removeFootnote () {
    const model = this.props.model
    this.send('remove-item', model)
  }
}
