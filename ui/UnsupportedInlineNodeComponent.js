'use strict';

var Component = require('substance/ui/Component');
var Modal = require('substance/ui/Modal');
var EditXML = require('./EditXML');

function UnsupportedInlineNodeComponent() {
  Component.apply(this, arguments);

  this.handleActions({
    'closeModal': this._closeModal
  });
}

UnsupportedInlineNodeComponent.Prototype = function() {
  this._openModal = function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      editXML: true
    });
  };

  this._closeModal = function() {
    this.setState({
      editXML: false
    });
  };

  this.render = function($$) {
    var el = $$('span')
      .addClass('sc-unsupported-inline-node')
      .attr('data-id', this.props.node.id)
      .attr('contenteditable', false)
      .append(
        $$('button').addClass('se-toggle').append(
          '<'+this.props.node.tagName+'>'
        ).on('click', this._openModal)
      );

    if (this.state.editXML) {
      el.append(
        $$(Modal, {
          width: 'medium'
        }).append(
          $$(EditXML, {node: this.props.node})
        )
      );
    }
    return el;
  };
};

Component.extend(UnsupportedInlineNodeComponent);

module.exports = UnsupportedInlineNodeComponent;