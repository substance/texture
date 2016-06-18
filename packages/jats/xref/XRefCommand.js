'use strict';

var AnnotationCommand = require('substance/ui/AnnotationCommand');

function XRefCommand() {
  XRefCommand.super.apply(this, arguments);
}

XRefCommand.Prototype = function() {

  this.canCreate = function() {
    return false;
  };

  this.canFuse = function() {
    return false;
  };

  this.canEdit = function(annos, sel) { // eslint-disable-line
    return annos.length === 1;
  };

  this.canDelete = function(annos, sel) { // eslint-disable-line
    return false;
  };
};

AnnotationCommand.extend(XRefCommand);

XRefCommand.static.name = 'xref';

module.exports = XRefCommand;