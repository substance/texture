import { AnnotationComponent } from 'substance'

export default class ExtLinkComponent extends AnnotationComponent {
  didMount (...args) {
    super.didMount(...args)
    let node = this.props.node
    this.context.editorSession.onRender('document', this.rerender, this, {
      path: [node.id, 'attributes', 'xlink:href']
    })
  }

  dispose (...args) {
    super.dispose(...args)
    this.context.editorSession.off(this)
  }

  render($$) { // eslint-disable-line
    let el = super.render($$)
    let node = this.props.node
    el.tagName = 'a'
    el.attr('href', node.attr('xlink:href'))
    return el
  }
}
