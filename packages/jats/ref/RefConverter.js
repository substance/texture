'use strict';

var JATS = require('../JATS');
var REF_MODEL = ['label', 'note', 'x'].concat(JATS.CITATION);

module.exports = {

  type: 'ref',
  tagName: 'ref',
  canContain: REF_MODEL,

  /*
    (label?, (citation-alternatives | element-citation | mixed-citation | nlm-citation | note | x)+)
  */
  import: function(el, node, converter) {
    node.xmlAttributes = el.getAttributes();
    node.xmlContent = el.innerHTML;
  },

  export: function(node, el, converter) {
    var $$ = converter.$$;
    el.attr(node.xmlAttributes);
    el.innerHTML = node.xmlContent;
  }

};
