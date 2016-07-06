'use strict';

var AnnotationTool = require('substance/ui/AnnotationTool');

function BoldTool() {
  BoldTool.super.apply(this, arguments);
}
AnnotationTool.extend(BoldTool);

BoldTool.static.name = 'bold';

module.exports = BoldTool;