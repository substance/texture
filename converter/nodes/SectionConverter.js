'use strict';

module.exports = {

  type: 'heading',
  tagName: 'sec',

  allowedContext: [
    'abstract', 'ack', 'app', 'back', 'bio', 'body', 'boxed-text',
    'notes', 'sec', 'trans-abstract'
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

    node.xmlAttributes = el.getAttributes();

    var currentLevel = state.getCurrentSectionLevel();
    node.level = currentLevel;
    state.increaseSectionLevel();

    var children = el.getChildren();
    var child, i = 0;
    if ((child = children[i]) && child.tagName === 'sec-meta') {
      var secMeta = converter.convertElement(child);
      node.meta = secMeta.id;
      i++;
    }
    if ((child = children[i]) && child.tagName === 'label') {
      node.label = converter.annotatedText(child, [node.id, 'label']);
      i++;
    }
    if ((child = children[i]) && child.tagName === 'title') {
      node.content = converter.annotatedText(child, [node.id, 'content']);
      i++;
    }
    node.contentNodes = converter._convertContainerElement(el, i);
    state.decreaseSectionLevel();
  },

  export: function(node, el, converter) {
    debugger;
    var doc = node.getDocument();
    el.attr(node.xmlAttributes);

    var nodesIt = converter.sectionContainerIterator;
    if (!nodesIt) {
      throw new Error('Section support is not done on parent element ' + el.parentNode.tagName);
    }
    while (nodesIt.hasNext()) {
      var nextNode = doc.get(nodesIt.next());
      if (nextNode.type === 'heading' && node.level >= nextNode.level) {
        break;
      }
      el.append(converter.convertNode(nextNode));
    }
  }

};
