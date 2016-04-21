'use strict';

var JATSNode = require('./JATSNode');

function Figure() {
  Figure.super.apply(this, arguments);

  // HACK: to be considered in the converter
  this._isPropertyAnnotation = true;
}

JATSNode.extend(Figure);

Figure.static.name = "figure";

// Figure.static.isBlock = true;

// Figure is currently called as an inline annotation inside a paragraph
// we need to set isPropertyAnnotation so it is considered in the converter
// according to most JATS markup styles (e.g. body > p > fig)
Figure.static.isPropertyAnnotation = true;
Figure.static.isInline = true;

Figure.static.defineSchema({
  xmlAttributes: { type: 'object', default: {} },
  objectIdNodes: { type: ['id'], default: [] },
  label: { type: 'text', optional: true },
  captionNodes: { type: ['id'], default: [] },
  abstractNodes: { type: ['id'], default: [] },
  kwdGroupNodes: { type: ['id'], default: [] },
  contentNodes: { type: ['id'], default: [] },
  attribNodes: { type: ['id'], default: [] },
});

module.exports = Figure;