import { InlineNodeComponent } from 'substance'

export default class TextureIsolatedInlineNodeComponent extends InlineNodeComponent {
  _getContentProps () {
    let props = super._getContentProps()
    props.model = this.props.model
    return props
  }

  // This must call the model API
  selectNode () {
    // console.log('IsolatedNodeComponent: selecting node.');
    let editorSession = this.context.editorSession
    let surface = this.context.surface
    let node = this.props.node
    editorSession.setSelection({
      type: 'property',
      path: node.start.path,
      startOffset: node.start.offset,
      endOffset: node.end.offset,
      containerId: surface.getContainerId(),
      surfaceId: surface.id
    })
  }
}
