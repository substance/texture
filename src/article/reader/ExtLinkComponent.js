import { AnnotationComponent } from 'substance'
import { NodeComponentMixin } from '../../kit'

export default class ExtLinkComponent extends NodeComponentMixin(AnnotationComponent) {
  render($$) { // eslint-disable-line
    let el = super.render($$)
    let node = this.props.node
    el.tagName = 'a'
    el.attr('href', node.attr('xlink:href'))
    return el
  }
}
