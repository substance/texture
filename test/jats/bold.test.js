'use strict';

var test = require('./test').module('jats/bold');

var withAttributes =
  '<bold id="mybold"'+
    'specific-use="test" toggle="test-toggle" xml:base="test-base">'+
  '</bold>';
test.attributesConversion(withAttributes, 'bold');
