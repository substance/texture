import { TextPropertyComponent as SubstanceTextPropertyComponent } from 'substance'

/*
  Overriding the original implementation
  - 1. to be able to pass down Model instances to inline nodes and annotations
  - 2. to change the way how place-holders are rendered
*/
export default class TextPropertyComponentNew extends SubstanceTextPropertyComponent {
  render ($$) {
    let path = this.getPath()

    let el = this._renderContent($$)
      .addClass('sc-text-property')
      .attr({
        'data-path': path.join('.')
      })
      .css({
        'white-space': 'pre-wrap'
      })

    if (this.isEmpty()) {
      el.addClass('sm-empty')
      if (this.props.placeholder) {
        el.setAttribute('data-placeholder', this.props.placeholder)
      }
    }

    if (!this.props.withoutBreak) {
      el.append($$('br'))
    }

    return el
  }

  _getFragmentProps (node) {
    let props = super._getFragmentProps(node)
    let model = this.context.api.getModelById(node.id)
    props.model = model
    return props
  }

  _getUnsupportedInlineNodeComponentClass () {
    return this.getComponent('unsupported-inline-node')
  }
}
