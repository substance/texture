import UnsupportedNode from './UnsupportedNode'
import UnsupportedInlineNode from './UnsupportedInlineNode'
import UnsupportedNodeComponent from './UnsupportedNodeComponent'
import UnsupportedInlineNodeComponent from './UnsupportedInlineNodeComponent'
import UnsupportedNodeJATSConverter from './UnsupportedNodeJATSConverter'
import UnsupportedInlineNodeJATSConverter from './UnsupportedInlineNodeJATSConverter'
import UnsupportedInlineNodeCommand from './UnsupportedInlineNodeCommand'
import UnsupportedInlineNodeTool from './UnsupportedInlineNodeTool'

export default {
  name: 'unsupported',
  configure: function(config) {
    config.addNode(UnsupportedNode)
    config.addNode(UnsupportedInlineNode)
    config.addComponent(UnsupportedNode.static.name, UnsupportedNodeComponent)
    config.addComponent(UnsupportedInlineNode.static.name, UnsupportedInlineNodeComponent)
    config.addCommand(UnsupportedInlineNodeCommand)
    config.addTool(UnsupportedInlineNodeTool, { overlay: true })
    config.addConverter('jats', UnsupportedNodeJATSConverter)
    config.addConverter('jats', UnsupportedInlineNodeJATSConverter)
  }
}
