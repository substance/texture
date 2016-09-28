import { module } from './test'

const test = module('jats/italic')

var withAttributes =
  '<italic id="myitalic"'+
  '   specific-use="test" toggle="test-toggle" xml:base="test-base">'+
  '</italic>';
test.attributesConversion(withAttributes, 'italic');
