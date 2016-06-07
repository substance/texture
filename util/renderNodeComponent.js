'use strict';

module.exports = function renderNodeComponent(self, $$, node) {
  var componentRegistry = this.props.componentRegistry || this.context.componentRegistry;
  var ComponentClass = componentRegistry.get(node.type);
  if (!ComponentClass) {
    console.error('Could not resolve a component for node type ' + node.type);
    ComponentClass = componentRegistry.get('unsupported');
  }
  return $$(ComponentClass, {
    node: node
  });
};
