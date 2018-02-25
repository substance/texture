import { Component } from 'substance'

export default class BodyComponent extends Component {

  render($$) {
    const body = this.props.node
    let el = $$('div')
      .addClass('sc-body')
      .attr('data-id', body.id)

    // There can be multiple abstracts. We just take the first
    const content = body.findChild('body-content')
    let contentEl
    if (content) {
      contentEl = $$(this.getComponent('container'), {
        placeholder: 'Enter Text',
        name: 'bodyEditor',
        node: content,
        disabled: this.props.disabled
      })
    } else {
      // TODO: ability to add an abstract
    }
    el.append(contentEl)

    // optional sig-block
    let sigBlock = body.findChild('sig-block')
    if (sigBlock) {
      el.append(
        $$(this.getComponent('sig-block'), { node: sigBlock })
      )
    } else {
      // TODO: means to add a signature
    }

    return el
  }

}
