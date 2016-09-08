'use strict';

import { Component } from 'substance'
import renderNodeComponent from '../../../util/renderNodeComponent'

class ContribGroupComponent extends Component {
  didMount() {
    super.didMount();
    var node = this.props.node;
    node.on('nodes:changed', this.rerender, this);
  }

  dispose() {
    super.dispose();
    var node = this.props.node;
    node.off(this);
  }

  render($$) {
    var node = this.props.node;
    var doc = node.getDocument();

    var el = $$('div')
      .addClass('sc-contrib-group')
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

    // el.append($$('button').addClass('se-add-author').append('Add Author'));
    return el;
  }

}

export default ContribGroupComponent;