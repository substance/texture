import { module } from './test'

const test = module('jats/subscript')

var withAttributes =
  '<sub id="mysubscript"'+
  '   specific-use="test" arrange="test-arrange" xml:base="test-base">'+
  '</sub>';
test.attributesConversion(withAttributes, 'subscript');
