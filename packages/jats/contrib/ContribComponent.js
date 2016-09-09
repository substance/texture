'use strict';

var Component = require('substance/ui/Component');
var Modal = require('substance/ui/Modal');
var EditXML = require('../../common/EditXML');
var EditContrib = require('./EditContrib');
var getAdapter = require('./contribUtils').getAdapter;

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
    var contrib = getAdapter(this.props.node);
    var el = $$('div').addClass('sc-contrib')
      .append(
        $$('div').addClass('se-name')
          .append(contrib.fullName)
          .on('click', this._toggleEditor)
      );

    if (this.state.editXML) {
      // Conforms to strict markup enforced by texture
      // for visual editing
      var EditorClass;
      if (contrib.strict) {
        EditorClass = EditContrib;
      } else {
        EditorClass = EditXML;
      }

      el.append(
        $$(Modal, {
          width: 'medium'
        }).append(
          $$(EditorClass, contrib)
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
    this.setState({
      editXML: true
    });
  };

};

Component.extend(ContribComponent);

module.exports = ContribComponent;
