'use strict';

import { Component } from 'substance'
import renderNodeComponent from '../../../util/renderNodeComponent'

class RefListComponent extends Component {
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
    var el = $$('div').addClass('sc-ref-list');

    // NOTE: We don't yet expose RefList.label to the editor
    if (node.title) {
      var titleNode = doc.get(node.title);
      el.append(
        renderNodeComponent(this, $$, titleNode, {
          disabled: this.props.disabled
        })
      );
    }

    // Ref elements
    var children = node.nodes;
    children.forEach(function(nodeId) {
      var childNode = doc.get(nodeId);
      if (childNode.type !== 'unsupported') {
        el.append(
          renderNodeComponent(this, $$, childNode, {
            disabled: this.props.disabled
          })
        );
      } else {
        console.info(childNode.type+ ' inside <ref-list> currently not supported by the editor.');
      }
    }.bind(this));

    return el;
  }
}

// Isolated Nodes config
RefListComponent.fullWidth = true;
RefListComponent.noStyle = true;

export default RefListComponent;