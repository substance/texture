import { IsolatedNodeComponent } from 'substance'

export default class TextureIsolatedNodeComponent extends IsolatedNodeComponent {
  _getContentProps () {
    let props = super._getContentProps()
    props.model = this.props.model
    return props
  }

  // TODO: this must call the API.
  selectNode () {
    // console.log('IsolatedNodeComponent: selecting node.');
    let editorSession = this.context.editorSession
    let surface = this.context.surface
    let nodeId = this.props.node.id
    editorSession.setSelection({
      type: 'node',
      nodeId: nodeId,
      containerId: surface.getContainerId(),
      surfaceId: surface.id
    })
  }

  // ATTENTION: please refactor substance.IsolatedNodeComponent.renderContent($$, node, opts)
  // so that we can drop 'node' from the signature. After introducing
  // INC.getContentProps() this can be done.
  renderContent (...args) {
    return super.renderContent(...args)
  }
}
