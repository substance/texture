import { Component, FontAwesomeIcon as Icon } from 'substance'

export default class FnComponent extends Component {
  render($$) {
    const node = this.props.node
    let el = $$('div')
      .addClass('sc-fn-item')
      .attr('data-id', node.id)

    let label = this.context.labelGenerator.getPosition('fn', node.id)
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
        $$('div').addClass('se-remove-ref')
          .append(
            $$(Icon, { icon: 'fa-trash' })
          )
          .on('click', this._removeFn.bind(this, node.id))
      )
    )
    return el
  }

  _removeFn(fnId) {
    this.send('removeFn', fnId)
  }
}
