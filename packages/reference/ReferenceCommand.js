'use strict';

var AnnotationCommand = require('substance/ui/AnnotationCommand');

/* TODO: It may make sense to define an InlineNodeCommand that covers creating, editing */

function ReferenceCommand() {
  ReferenceCommand.super.apply(this, arguments);
}

ReferenceCommand.Prototype = function() {

  this.canCreate = function() {
    return false;
  };

  this.canFuse = function() {
    return false;
  };

  // When there's some overlap with only a single annotation we do an expand
  this.canEdit = function(annos, sel) { // eslint-disable-line
    return annos.length === 1;
  };

  this.canDelete = function(annos, sel) { // eslint-disable-line
    return false;
  };

};

AnnotationCommand.extend(ReferenceCommand);

ReferenceCommand.static.name = 'reference';

module.exports = ReferenceCommand;