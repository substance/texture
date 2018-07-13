import { Component } from 'substance'

export default class BodyComponent extends Component {

  render($$) {
    const body = this.props.model
    let el = $$('div')
      .addClass('sc-body')
      .attr('data-id', body.id)

    // TODO: do we really want use ContainerEditor for both reader and editor?
    let contentEl = $$(this.getComponent('container'), {
      placeholder: 'Enter Text',
      name: 'bodyEditor',
      node: body.getContainerNode(),
      disabled: this.props.disabled
    })

    el.append(contentEl)
    return el
  }

}
