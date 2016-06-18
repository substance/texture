'use strict';

module.exports = {

  type: "xref",
  tagName: "xref",

  /*
    Content:
      (%all_phrase | break)*
  */

  /* <xref ref-type="bibr" rid="bib50">Steppuhn and Baldwin, 2007</xref> */

  import: function(el, node, converter) {
    node.target = el.attr('rid');
    node.label = converter.annotatedText(el, [node.id, 'label']);
  },

  export: function(node, el, converter) {
    el.attr(node.xmlAttributes);
    el.attr({
      'rid': node.target,
      'ref-type': node.referenceType
    });
    el.append(converter.annotatedText([node.id, 'label']));
  }
};

