'use strict';

var AnnotationCommand = require('substance/ui/AnnotationCommand');

function UnsupportedNodeCommand() {
  UnsupportedNodeCommand.super.apply(this, arguments);
}

UnsupportedNodeCommand.Prototype = function() {
  this.canCreate = function() {
    return false;
  };

  this.canFuse = function() {
    return false;
  };

  this.canEdit = function(annos, sel) { // eslint-disable-line
    return annos.length === 1 && annos[0].getSelection().equals(sel);
  };

  this.canDelete = function(annos, sel) { // eslint-disable-line
    return false;
  };
};

AnnotationCommand.extend(UnsupportedNodeCommand);
UnsupportedNodeCommand.static.name = 'unsupported-inline';
module.exports = UnsupportedNodeCommand;



