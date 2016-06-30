'use strict';

var test = require('./test').module('jats/superscript');

var withAttributes =
  '<superscript id="mysuperscript"'+
    'specific-use="test" arrange="test-arrange" xml:base="test-base">'+
  '</superscript>';
test.attributesConversion(withAttributes, 'superscript');
