'use strict';

var AnnotationTool = require('substance/ui/AnnotationTool');

function AddXRefTool() {
  AddXRefTool.super.apply(this, arguments);
}

AnnotationTool.extend(AddXRefTool);

module.exports = AddXRefTool;