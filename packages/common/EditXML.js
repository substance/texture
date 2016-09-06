'use strict';

var Component = require('substance/ui/Component');
var XMLAttributeEditor = require('./XMLAttributeEditor');
var XMLEditor = require('./XMLEditor');
var Button = require('substance/ui/Button');

function EditXML() {
  EditXML.super.apply(this, arguments);
}

EditXML.Prototype = function() {
  this.render = function($$) {
    var node = this.props.node;
    var el = $$('div').addClass('sc-edit-xml');
    var tagName = node.tagName;

    el.append(
      $$('div').addClass('se-tag sm-open-tag-start').append('<'+tagName)
    );

    el.append(
      $$(XMLAttributeEditor, {
        attributes: node.attributes
      }).ref('attributesEditor')
    );

    el.append(
      $$('div').addClass('se-tag sm-open-tag-end').append('>')
    );

    el.append(
      $$(XMLEditor, {
        xml: node.xmlContent
      }).ref('xmlEditor')
    );

    el.append(
      $$('div').addClass('se-tag sm-end-tag').append('</'+tagName+'>')
    );

    el.append(
      $$('div').addClass('se-actions').append(
        $$(Button).append('Save').on('click', this._save),
        $$(Button).addClass('se-cancel').append('Cancel').on('click', this._cancel)
      )
    );
    return el;
  };

  this._cancel = function() {
    this.send('closeModal');
  };

  this._delete = function() {
    console.warn('Not yet implemented');
    // TODO: this is actually not very trivial as we don't
    // know the node's context. E.g. when deleting
    // a contrib node we need to remove the id from
  };

  this._save = function() {
    var documentSession = this.context.documentSession;
    var node = this.props.node;

    var newAttributes = this.refs.attributesEditor.getAttributes();
    var newXML = this.refs.xmlEditor.getXML();

    // TODO: add validity checks. E.g. try to parse XML string
    documentSession.transaction(function(tx) {
      tx.set([node.id, 'xmlContent'], newXML);
      tx.set([node.id, 'attributes'], newAttributes);
    });
    this.send('closeModal');
  };
};

Component.extend(EditXML);

module.exports = EditXML;
