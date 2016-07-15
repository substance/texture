'use strict';

var Component = require('substance/ui/Component');
var Modal = require('substance/ui/Modal');
var EditXML = require('../../common/EditXML');
var contribToHTML = require('./contribToHTML');

function ContribComponent() {
  ContribComponent.super.apply(this, arguments);

  this.handleActions({
    'closeModal': this._closeModal,
    'xmlSaved': this._closeModal
  });

  this.props.node.on('properties:changed', this.rerender, this);
}

ContribComponent.Prototype = function() {

  this.render = function($$) {
    console.log('rendering contrib');
    var node = this.props.node;
    var el = $$('div').addClass('sc-contrib')
      .append(
        $$('div').addClass('se-name').html(contribToHTML(node))
          .on('click', this._toggleEditor)
      );

    if (this.state.editXML) {
      el.append(
        $$(Modal, {
          width: 'medium'
        }).append(
          $$(EditXML, {
            node: node
          })
        )
      );
    }
    return el;
  };

  this._closeModal = function() {
    this.setState({
      editXML: false
    });
  };

  this._toggleEditor = function() {
    console.log('toggle editor');
    this.setState({
      editXML: true
    });
  };

};

Component.extend(ContribComponent);

module.exports = ContribComponent;
