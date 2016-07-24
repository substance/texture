'use strict';

var Component = require('substance/ui/Component');
var map = require('lodash/map');

function XMLAttributeEditor() {
  XMLAttributeEditor.super.apply(this, arguments);
}

XMLAttributeEditor.Prototype = function() {

  this._getAttributeString = function() {
    return map(this.props.attributes, function(val, key) {
      return key+'='+val;
    }).join('\n');
  };

  this._parseAttributesFromString = function(newAttrs) {
    newAttrs = newAttrs.split('\n');
    var res = {};

    newAttrs.forEach(function(attr) {
      var parts = attr.split('=');
      res[parts[0]] = parts[1];
    });
    return res;
  };

  /* Returns the changed attributes */
  this.getAttributes = function() {
    var attrStr = this.refs.attributesEditor.val();
    return this._parseAttributesFromString(attrStr);
  };

  this.render = function($$) {
    var node = this.props.node;
    var el = $$('div').addClass('sc-xml-attribute-editor');
    var attributeStr = this._getAttributeString(node);
    el.append(
      $$('textarea')
        .ref('attributesEditor')
        .append(attributeStr)
    );
    return el;
  };
};

Component.extend(XMLAttributeEditor);

module.exports = XMLAttributeEditor;
