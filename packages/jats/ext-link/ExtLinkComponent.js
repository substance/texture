'use strict';

import { AnnotationComponent } from 'substance'

class ExtLinkComponent extends AnnotationComponent {

  didMount() {
    super.didMount.apply(this, arguments)

    var node = this.props.node
    node.on('properties:changed', this.rerender, this)
  }

  dispose() {
    super.dispose.apply(this, arguments)

    var node = this.props.node
    node.off(this)
  }

  render($$) { // eslint-disable-line
    var node = this.props.node;
    var el = super.render.apply(this, arguments)

    el.tagName = 'a'
    el.attr('href', node.attributes['xlink:href'])

    return el
  }

}

export default ExtLinkComponent
