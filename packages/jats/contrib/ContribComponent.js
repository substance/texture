'use strict';

import { Component, Modal } from 'substance'
import EditXML from '../../common/EditXML'
import contribToHTML from './contribToHTML'
import EditContrib from './EditContrib'
import { getAdapter } from './contribUtils'

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

export default ContribComponent;
