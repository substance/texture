import extend from 'lodash/extend'

export default function renderNodeComponent(self, $$, node, props) {
  props = props || {}
  let componentRegistry = self.props.componentRegistry || self.context.componentRegistry
  let ComponentClass = componentRegistry.get(node.type)
  if (!ComponentClass) {
    console.error('Could not resolve a component for node type ' + node.type)
    ComponentClass = componentRegistry.get('unsupported')
  }
  return $$(ComponentClass, extend({
    node: node
  }, props))
}
