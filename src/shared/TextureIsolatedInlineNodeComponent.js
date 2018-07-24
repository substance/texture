import { IsolatedInlineNodeComponent } from 'substance'

export default class TextureIsolatedInlineNodeComponent extends IsolatedInlineNodeComponent {
  _getContentProps () {
    let props = super._getContentProps()
    props.model = this.props.model
    return props
  }
}
