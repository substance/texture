'use strict';

var test = require('./test').module('jats/xref');

// attributes should be preserved
var withAttributes =
  '<xref ref-type="bibr" rid="bib40">Price et al., 1980</xref>';
test.attributesConversion(withAttributes, 'xref');

