'use strict';

module.exports = {

  type: 'heading',
  tagName: 'sec',

  allowedContext: [
    'abstract', 'ack', 'app', 'back', 'bio', 'body', 'boxedText',
    'notes', 'sec', 'transAbstract'
  ],

  /*

    Attributes
      disp-level Display Level of a Heading
      id Document Internal Identifier
      sec-type Type of Section
      specific-use Specific Use
      xml:base Base
      xml:lang Language

    Content
    (
      sec-meta?, label?, title?,
      ( address | alternatives | array |
        boxed-text | chem-struct-wrap | code | fig | fig-group |
        graphic | media | preformat | supplementary-material | table-wrap |
        table-wrap-group | disp-formula | disp-formula-group | def-list |
        list | tex-math | mml:math | p | related-article | related-object |
        ack | disp-quote | speech | statement | verse-group | x
      )*,
      (sec)*,
      (notes | fn-group | glossary | ref-list)*
    )
  */

  import: function(el, node, converter) {
    var state = converter.state;
    // set level and increase for subsections
    var currentLevel = state.getCurrentSectionLevel();
    node.level = currentLevel;
    state.increaseSectionLevel();
    // process children
    // as in the spec, the first three children are optional built-ins
    // which only occur at this position
    // TODO: to be strict these converters should be disabled afterwards
    var childNodes = el.getChildNodes();
    var i = 0;
    if (childNodes[i].tagName === 'sec-meta') {
      var secMeta = converter.convertElement(childNodes[i]);
      node.meta = secMeta.id;
      i++;
    }
    if (childNodes[i].tagName === 'label') {
      node.label = converter.annotatedText(childNodes[i], [node.id, 'label']);
      i++;
    }
    if (childNodes[i].tagName === 'title') {
      node.content = converter.annotatedText(childNodes[i], [node.id, 'content']);
      i++;
    }
    // other content
    converter._convertContainerElement(el, { nodes: [] }, i);
    state.decreaseSectionLevel();
  },

  export: function(node, el, converter) {
    converter.pushContainer(node);
    // consume all elements of the current container until
    // a heading is reached with level <= node.level
    converter.continue(function(childNode, childEl) {
      if (childNode.type === 'heading' && childNode.level <= node.level) {
        return false;
      }
      el.append(childEl);
    });
    converter.popContainer();
  }

};
