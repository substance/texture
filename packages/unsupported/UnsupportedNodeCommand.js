'use strict';

var AnnotationCommand = require('substance/ui/AnnotationCommand');

function UnsupportedNodeCommand() {
  UnsupportedNodeCommand.super.apply(this, arguments);
}

UnsupportedNodeCommand.Prototype = function() {

  this.getAnnotationData = function() {
    return {
      url: ""
    };
  };

  this.canCreate = function() {
    return false;
  };

  this.canFuse = function() {
    return false;
  };

  // When there's some overlap with only a single annotation we do an expand
  this.canEdit = function(annos, sel) {
    // jshint unused: false
    return annos.length === 1;
    return true;
  };

  this.canDelete = function(annos, sel) {
    // jshint unused: false
    return false;
  };

};

AnnotationCommand.extend(UnsupportedNodeCommand);

UnsupportedNodeCommand.static.name = 'unsupported';

module.exports = UnsupportedNodeCommand;