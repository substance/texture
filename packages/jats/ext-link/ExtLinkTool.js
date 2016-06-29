'use strict';

var AnnotationTool = require('substance/ui/AnnotationTool');

function ExtLinkTool() {
  ExtLinkTool.super.apply(this, arguments);
}

AnnotationTool.extend(ExtLinkTool);
ExtLinkTool.static.name = 'ext-link';

module.exports = ExtLinkTool;