import NodeComponent from '../shared/NodeComponent'
import { getLabel } from '../shared/nodeHelpers'

export default class FigComponent extends NodeComponent {
  render ($$) {
    const node = this.props.node
    let el = $$('div')
      .addClass('sc-' + node.type)
      .attr('data-id', node.id)

    let label = getLabel(node)
    let labelEl = $$('div').addClass('se-label').text(label)
    el.append(labelEl)

    const content = node.getContent()
    let contentEl
    if (content) {
      contentEl = $$(this.getComponent(content.type), {
        node: content,
        disabled: this.props.disabled
      })
      el.append(contentEl.ref('content'))
    }

    let titleEl = $$(this.getComponent('text-property-editor'), {
      placeholder: 'Enter Title',
      path: [node.id, 'title'],
      disabled: this.props.disabled
    }).addClass('se-title').ref('title')
    el.append(titleEl)

    // TODO: we need a ContainerEditor that can be configured using a path
    const caption = node.getCaption()
    let captionEl
    if (caption) {
      captionEl = $$(this.getComponent('container-editor'), {
        node: caption,
        disabled: this.props.disabled
      }).ref('caption')
      el.append(captionEl)
    }
    return el
  }

  _getContentType () {
    switch (this.props.node.type) {
      case 'table-wrap': {
        return 'table'
      }
      default: return 'graphic'
    }
  }
}
