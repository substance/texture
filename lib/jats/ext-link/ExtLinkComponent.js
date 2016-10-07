import { AnnotationComponent } from 'substance'

class ExtLinkComponent extends AnnotationComponent {

  didMount() {
    super.didMount.apply(this, arguments)

    let node = this.props.node
    node.on('properties:changed', this.rerender, this)
  }

  dispose() {
    super.dispose.apply(this, arguments)

    let node = this.props.node
    node.off(this)
  }

  render($$) { // eslint-disable-line
    let node = this.props.node;
    let el = super.render.apply(this, arguments)

    el.tagName = 'a'
    el.attr('href', node.attributes['xlink:href'])

    return el
  }

}

export default ExtLinkComponent
