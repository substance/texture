import { AnnotationComponent } from 'substance'
import NodeComponentMixin from '../../shared/NodeComponentMixin'

export default class ExtLinkComponent extends NodeComponentMixin(AnnotationComponent) {
  render($$) {
    let el = super.render($$)
    let node = this.props.node
    el.tagName = 'a'
    el.attr('href', node.attr('xlink:href'))
    return el
  }
}
