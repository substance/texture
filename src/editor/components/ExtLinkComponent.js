import { NodeComponent, AnnotationComponent } from 'substance'

export default class ExtLinkComponent extends AnnotationComponent {
  render($$) {
    let el = super.render($$)
    let node = this.props.node
    el.tagName = 'a'
    el.attr('href', node.attr('xlink:href'))
    el.attr('target', '_blank')
    return el
  }
}
