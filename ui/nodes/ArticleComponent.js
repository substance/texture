'use strict';

var Component = require('substance/ui/Component');

function ArticleComponent() {
  ArticleComponent.super.apply(this, arguments);

  this.componentRegistry = this.context.componentRegistry;
  if (!this.componentRegistry) {
    throw new Error('context.componentRegistry is mandatory.');
  }
}

ArticleComponent.Prototype = function() {
  this.render = function($$) {
    var articleNode = this.props.node;
    var doc = articleNode.getDocument();
    var body = doc.get(articleNode.body);

    var el = $$('div').addClass('sc-article');
    var bodyEl = $$('div').addClass('sc-body');

    body.nodes.forEach(function(nodeId) {
      var childNode = doc.get(nodeId);
      if (!childNode) {
        console.error('Could not get child node', nodeId);
        return;
      }
      var ComponentClass = this.componentRegistry.get(childNode.type);
      if (!ComponentClass) {
        console.error('No Component registered for tpye %s', childNode.type);
      }
      bodyEl.append($$(ComponentClass, { node: childNode, doc: doc }));
    }.bind(this));

    el.append(bodyEl);

    return el;
  };
};

Component.extend(ArticleComponent);

module.exports = ArticleComponent;
