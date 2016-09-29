import { Component, ContainerEditor, TextPropertyEditor } from 'substance'

class CaptionComponent extends Component {

  render($$) {
    let node = this.props.node
    let doc = node.getDocument()

    let el = $$('div')
      .addClass('sc-caption')
      .attr('data-id', node.id)

    if (node.title) {
      let title = doc.get(node.title);
      el.append($$(TextPropertyEditor, {
        disabled: this.props.disabled,
        path: title.getTextPath()
      })).ref('title')
    }

    let contentEl = $$('div').addClass('se-content')
    let contentEditor = $$(ContainerEditor, {
      disabled: this.props.disabled,
      node: node
    }).ref('content')
    contentEl.append(contentEditor)
    el.append(contentEl)

    return el
  }
}

export default CaptionComponent
