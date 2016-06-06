'use strict';

var Component = require('substance/ui/Component');
var clone = require('lodash/clone');

/*
  Prompt shown when an unsupported node is selected.
*/
function UnsupportedNodeTool() {
  UnsupportedNodeTool.super.apply(this, arguments);
}

UnsupportedNodeTool.Prototype = function() {

  this.render = function($$) {
    var node = this.props.node;
    var el = $$('div').addClass('sc-edit-link-tool');

    el.append(
      $$('div').addClass('se-actions').append(
        $$('button')
          .attr({title: this.i18n.t('edit')})
          .addClass('se-action')
          .on('click', this.onEdit),
        $$('button')
          .attr({title: this.i18n.t('delete')})
          .addClass('se-action')
          .on('click', this.onDelete)
      )
    );
    return el;
  };

  this.onEdit = function(e) {
    e.preventDefault();

    console.log('TODO: open XML editor');
    // console.log('YOYO');
    // var node = this.props.node;
    // var documentSession = this.context.documentSession;
    // var url = this.refs.url.val();
    // documentSession.transaction(function(tx) {
    //   tx.set([node.id, "url"], url);
    // }.bind(this));
  };

  this.onDelete = function(e) {
    e.preventDefault();
    var node = this.props.node;
    var documentSession = this.context.documentSession;
    documentSession.transaction(function(tx) {
      tx.delete(node.id);
    });
  };
};

Component.extend(UnsupportedNodeTool);

UnsupportedNodeTool.static.getProps = function(commandStates) {
  if (commandStates.unsupported.mode === 'edit') {
    return clone(commandStates.unsupported);
  } else {
    return undefined;
  }
};

UnsupportedNodeTool.static.name = 'unsupported';

module.exports = UnsupportedNodeTool;