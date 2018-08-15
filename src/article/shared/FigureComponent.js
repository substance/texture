import NodeComponent from '../shared/NodeComponent'

export default class FigureComponent extends NodeComponent {
  // TODO: In the reader, if title or caption is empty, should we drop those elements from the view?
  render ($$) {
    let model = this.props.model
    let title = model.getTitle()
    let caption = model.getCaption()
    let contentType = model.getContentType()
    let content = model.getContent()
    let label = model.getLabel()

    // TODO: switch to .sc-figure, once transition to a shared FigureComponent is complete
    let el = $$('div').addClass('sc-fig')
      .attr('id', model.id)
      .attr('data-id', model.id)

    let labelEl = $$('div').addClass('se-label').text(label)
    el.append(labelEl)

    if (content) {
      // TODO: switch to using model: content
      let contentEl = $$(this.getComponent(contentType), {
        model: content,
        node: content._node,
        disabled: this.props.disabled
      })
      el.append(contentEl.ref('content'))
    }

    let titleEl = $$(this.getComponent('text-property'), {
      placeholder: 'Enter Title',
      path: title.getTextPath(),
      disabled: this.props.disabled
    }).addClass('se-title').ref('title')
    el.append(titleEl)

    let captionEl
    if (caption) {
      captionEl = $$(this.getComponent('caption'), {
        // TODO: Use a component that works on the ContainerModel rather than ContainerNode
        node: caption.getContainerNode(),
        disabled: this.props.disabled
      }).ref('caption')
      el.append(captionEl)
    }
    return el
  }
}
