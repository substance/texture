'use strict';

var FigureConverter = require('./FigureConverter');

module.exports = {

  type: 'table-wrap',
  tagName: 'table-wrap',
  allowedContext: FigureConverter.allowedContext,

  import: FigureConverter.import,
  export: FigureConverter.export

};
