import { module } from './test'

const test = module('jats/bold')

var withAttributes =
  '<bold id="mybold"'+
  '   specific-use="test" toggle="test-toggle" xml:base="test-base">'+
  '</bold>';
test.attributesConversion(withAttributes, 'bold');
