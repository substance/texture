import { Component } from 'substance'

export default class BodyComponent extends Component {

  render($$) {
    const body = this.props.node
    let el = $$('div')
      .addClass('sc-body')
      .attr('data-id', body.id)
    
    el.append(
      $$(this.getComponent('container'), {
        placeholder: 'Enter Text',
        name: 'bodyEditor',
        node: body,
        disabled: this.props.disabled
      })
    )
    return el
  }

}
