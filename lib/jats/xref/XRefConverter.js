export default {

  type: "xref",
  tagName: "xref",

  /*
    Content:
      (%all_phrase | break)*
  */

  /* <xref ref-type="bibr" rid="bib50 bib51">Steppuhn and Baldwin, 2007</xref> */

  import: function(el, node, converter) {
    Object.assign(node.attributes, el.getAttributes())
    node.targets = el.attr('rid').split(' ')
    node.label = converter.annotatedText(el, [node.id, 'label'])
  },

  export: function(node, el, converter) { // eslint-disable-line
    el.attr(node.attributes)
    el.attr('rid', node.targets.join(' '))
    el.append(
      converter.annotatedText([node.id, 'label'])
    )
  }
}