import UnsupportedNode from './UnsupportedNode'
import UnsupportedInlineNode from './UnsupportedInlineNode'
import UnsupportedNodeComponent from './UnsupportedNodeComponent'
import UnsupportedInlineNodeComponent from './UnsupportedInlineNodeComponent'
import UnsupportedNodeJATSConverter from './UnsupportedNodeJATSConverter'
import UnsupportedInlineNodeJATSConverter from './UnsupportedInlineNodeJATSConverter'
import InlineNodeCommand from 'substance/ui/InlineNodeCommand'
import UnsupportedInlineNodeTool from './UnsupportedInlineNodeTool'

export default {
  name: 'unsupported',
  configure: function(config) {
    config.addNode(UnsupportedNode)
    config.addNode(UnsupportedInlineNode)
    config.addComponent(UnsupportedNode.type, UnsupportedNodeComponent)
    config.addComponent(UnsupportedInlineNode.type, UnsupportedInlineNodeComponent)
    config.addCommand(UnsupportedInlineNode.type, InlineNodeCommand, { nodeType: UnsupportedInlineNode.type })
    config.addTool(UnsupportedInlineNode.type, UnsupportedInlineNodeTool, { overlay: true })
    config.addConverter('jats', UnsupportedNodeJATSConverter)
    config.addConverter('jats', UnsupportedInlineNodeJATSConverter)
  }
}
