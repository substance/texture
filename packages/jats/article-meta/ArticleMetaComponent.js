'use strict';

import { Component } from 'substance'
import renderNodeComponent from '../../../util/renderNodeComponent'

function ArticleMetaComponent() {
  Component.apply(this, arguments);
}

ArticleMetaComponent.Prototype = function() {

  this.render = function($$) {
    var node = this.props.node;
    var doc = node.getDocument();

    var el = $$('div')
      .addClass('sc-article-meta')
      .attr('data-id', this.props.node.id);

    var children = node.nodes;
    children.forEach(function(nodeId) {
      var childNode = doc.get(nodeId);
      if (childNode.type !== 'unsupported') {
        el.append(
          renderNodeComponent(this, $$, childNode, {
            disabled: this.props.disabled
          })
        );
      }
    }.bind(this));
    return el;
  };
};

Component.extend(ArticleMetaComponent);

export default ArticleMetaComponent;