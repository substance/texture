'use strict';

var AnnotationCommand = require('substance/ui/AnnotationCommand');

/*
  TODO: Define an InlineNodeCommand that defines a language for
  inline node tools
*/

function CrossReferenceCommand() {
  CrossReferenceCommand.super.apply(this, arguments);
}

CrossReferenceCommand.Prototype = function() {

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

AnnotationCommand.extend(CrossReferenceCommand);

CrossReferenceCommand.static.name = 'cross-reference';

module.exports = CrossReferenceCommand;