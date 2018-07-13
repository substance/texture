import { TextPropertyComponent } from 'substance'

export default class TextureTextPropertyComponent extends TextPropertyComponent {
  _getFragmentProps (node) {
    let props = super._getFragmentProps(node)
    let model = this.context.api.getModel(node)
    props.model = model
    return props
  }

  _getUnsupportedInlineNodeComponentClass () {
    return this.getComponent('unsupported-inline-node')
  }
}
