'use strict';

var AnnotationTool = require('substance/ui/AnnotationTool');

function BoldTool() {
  BoldTool.super.apply(this, arguments);
}
AnnotationTool.extend(BoldTool);

module.exports = BoldTool;