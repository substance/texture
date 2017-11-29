import { Component } from 'substance'
import Button from './Button'
import { getLabel } from '../util/nodeHelpers'

export default class FnComponent extends Component {

  render($$) {
    const node = this.props.node
    let el = $$('div')
      .addClass('sc-fn-item')
      .attr('data-id', node.id)

    let label = getLabel(node) || '???'
    let contentEl = $$(this.getComponent('container'), {
      placeholder: 'Enter Footnote',
      node: node,
      disabled: this.props.disabled
    }).ref('editor')
    el.append(
      $$('div').addClass('se-fn-container').append(
        $$('div').addClass('se-label').append(
          label
        ),
        contentEl,
        $$(Button, {icon: 'trash', tooltip: 'remove'}).addClass('se-remove-ref')
          .on('click', this._removeFn.bind(this, node.id))
      )
    )
    return el
  }

  _removeFn(fnId) {
    this.send('removeFn', fnId)
  }
}
