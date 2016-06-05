'use strict';

var FigureJATSConverter = require('../figure/FigureJATSConverter');

module.exports = {

  type: 'table-wrap',
  tagName: 'table-wrap',
  allowedContext: FigureJATSConverter.allowedContext,

  import: FigureJATSConverter.import,
  export: FigureJATSConverter.export

};