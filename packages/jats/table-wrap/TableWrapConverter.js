'use strict';

var FigureConverter = require('../figure/FigureConverter');

module.exports = {

  type: 'table-wrap',
  tagName: 'table-wrap',
  canContain: FigureConverter.canContain,

  import: FigureConverter.import,
  export: FigureConverter.export
};