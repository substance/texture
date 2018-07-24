import { IsolatedNodeComponent } from 'substance'

export default class TextureIsolatedNodeComponent extends IsolatedNodeComponent {
  _getContentProps () {
    let props = super._getContentProps()
    props.model = this.props.model
    return props
  }
}
