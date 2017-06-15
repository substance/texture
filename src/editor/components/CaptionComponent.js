import { Component } from 'substance'

export default class CaptionComponent extends Component {

  render($$) {
    const node = this.props.node
    const captionContent = node.find('caption-content')
    const title = node.find('title')

    let el = $$('div')
      .addClass('sc-caption')
      .attr('data-id', node.id)
    let titleEl = $$(this.getComponent('text-property-editor'), {
      path: title.getTextPath(),
      disabled: this.props.disabled
    }).addClass('se-caption-title').ref('captionTitle')
    el.append(titleEl)
    let contentEl = $$(this.getComponent('container'), {
      node: captionContent,
      disabled: this.props.disabled
    })
    el.append(contentEl)
    return el
  }
}
