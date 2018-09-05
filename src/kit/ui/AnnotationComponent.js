import { AnnotationComponent as SubstanceAnnotationComponent } from 'substance'

export default class AnnotationComponent extends SubstanceAnnotationComponent {
  getClassNames () {
    return `sc-annotation sm-${this.props.node.type}`
  }
}
