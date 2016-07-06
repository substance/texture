'use strict';

var test = require('./test').module('jats/italic');

var withAttributes =
  '<italic id="myitalic"'+
  '   specific-use="test" toggle="test-toggle" xml:base="test-base">'+
  '</italic>';
test.attributesConversion(withAttributes, 'italic');
