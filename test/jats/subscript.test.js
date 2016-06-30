'use strict';

var test = require('./test').module('jats/subscript');

var withAttributes =
  '<subscript id="mysubscript"'+
    'specific-use="test" arrange="test-arrange" xml:base="test-base">'+
  '</subscript>';
test.attributesConversion(withAttributes, 'subscript');
