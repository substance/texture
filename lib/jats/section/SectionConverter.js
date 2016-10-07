import JATS from '../JATS'
import XMLIterator from '../../util/XMLIterator'

export default {

  type: 'section',
  tagName: 'sec',

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

    let children = el.getChildren()
    let iterator = new XMLIterator(children)

    iterator.optional('sec-meta', function(child) {
      node.meta = converter.convertElement(child).id
    })
    iterator.optional('label', function(child) {
      node.label = converter.convertElement(child).id
    })
    iterator.optional('title', function(child) {
      node.title = converter.convertElement(child).id
    })

    iterator.manyOf(JATS.PARA_LEVEL, function(child) {
      node.nodes.push(converter.convertElement(child).id)
    })

    iterator.manyOf(['sec'], function(child) {
      node.nodes.push(converter.convertElement(child).id)
    })

    iterator.manyOf(["notes","fn-group","glossary","ref-list"], function(child) {
      node.backMatter.push(converter.convertElement(child).id)
    })

    if (iterator.hasNext()) {
      throw new Error('Illegal JATS: ' + el.outerHTML)
    }
  },

  export: function(node, el, converter) {
    let $$ = converter.$$

    el.attr(node.xmlAttributes)
    if (node.meta) {
      el.append(
        $$('sec-meta').append(
          converter.convertNode(node.meta)
        )
      )
    }
    if(node.label) {
      el.append(converter.convertNode(node.label))
    }
    if(node.title) {
      el.append(converter.convertNode(node.title))
    }
    node.nodes.forEach(function(nodeId) {
      el.append(converter.convertNode(nodeId))
    })
    node.backMatter.forEach(function(nodeId) {
      el.append(converter.convertNode(nodeId))
    })
  }

}
