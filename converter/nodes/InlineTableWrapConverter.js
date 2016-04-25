'use strict';

var InlineFigureConverter = require('./InlineFigureConverter');

module.exports = {

  type: 'inline-table-wrap',
  tagName: 'table-wrap',
  allowedContext: InlineFigureConverter.allowedContext,

  import: InlineFigureConverter.import,
  export: InlineFigureConverter.export

};
