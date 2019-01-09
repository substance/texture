import { AnnotationComponent } from 'substance'
import { NodeComponentMixin } from '../../kit'

export default class ExtLinkComponent extends NodeComponentMixin(AnnotationComponent) {
  render ($$) {
    let node = this.props.node
    let el = super.render($$)
    el.attr('href', node.href)
    return el
  }

  getTagName () {
    return 'a'
  }
}
