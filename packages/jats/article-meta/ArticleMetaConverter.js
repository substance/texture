import XMLIterator from '../../../util/XMLIterator'
import JATS from '../JATS'

export default {

  type: 'article-meta',
  tagName: 'article-meta',

  /*
    Attributes
      id Document Internal Identifier
      xml:base Base
    Content
      (article-id*, article-categories?,
         title-group?,
         (%contrib-group.class; |
          %aff-alternatives.class; | %x.class;)*,
         author-notes?, pub-date*,
         volume*, volume-id*, volume-series?,
         issue*, issue-id*, issue-title*,
         issue-sponsor*, issue-part?,
         volume-issue-group*, isbn*,
         supplement?,
         ( ( (fpage, lpage?)?, page-range?) |
           elocation-id )?,
         (%address-link.class; | product |
          supplementary-material)*,
         history?, permissions?, self-uri*,
         (%related-article.class;)*,
         (%abstract.class;)*, trans-abstract*,
         (%kwd-group.class;)*, funding-group*,
         conference*, counts?, custom-meta-group?)
  */
  import: function(el, node, converter) {
    node.id = 'article-meta'; // there is only one <article-meta> element
    let iterator = new XMLIterator(el.getChildren())
    let elements

    iterator.manyOf(['article-id'], function(child) {
      node.nodes.push(converter.convertElement(child).id)
    })
    iterator.optional('article-categories', function(child) {
      node.nodes.push(converter.convertElement(child).id)
    })
    iterator.optional('title-group', function(child) {
      node.nodes.push(converter.convertElement(child).id)
    })
    // %contrib-group.class; | %aff-alternatives.class; | %x.class;
    elements = JATS.CONTRIB_GROUP
      .concat(JATS.AFF_ALTERNATIVES)
      .concat(JATS.X)
    iterator.manyOf(elements, function(child) {
      node.nodes.push(converter.convertElement(child).id)
    })
    iterator.optional('author-notes', function(child) {
      node.nodes.push(converter.convertElement(child).id)
    })
    // pub-date*, volume*, volume-id*
    iterator.manyOf(['pub-date', 'volume', 'volume-id'], function(child) {
      node.nodes.push(converter.convertElement(child).id)
    })
    iterator.optional('volume-series', function(child) {
      node.nodes.push(converter.convertElement(child).id)
    })
    iterator.manyOf(['issue', 'issue-id', 'issue-title', 'issue-sponsor'], function(child) {
      node.nodes.push(converter.convertElement(child).id)
    })
    iterator.optional('issue-part', function(child) {
      node.nodes.push(converter.convertElement(child).id)
    })
    iterator.manyOf(['volume-issue-group', 'isbn'], function(child) {
      node.nodes.push(converter.convertElement(child).id)
    })
    iterator.optional('supplement', function(child) {
      node.nodes.push(converter.convertElement(child).id)
    })
    // ( ( (fpage, lpage?)?, page-range?) |
    //   elocation-id )?,
    //
    // TODO: XMLIterator can't handle such complex optionals atm
    iterator.manyOf(['fpage', 'lpage', 'page-range', 'elocation-id'], function(child) {
      node.nodes.push(converter.convertElement(child).id)
    })
    // (%address-link.class; | product |
    //  supplementary-material)*,
    elements = JATS.ADDRESS_LINK.concat(['product', 'supplementary-material']);
    iterator.manyOf(elements, function(child) {
      node.nodes.push(converter.convertElement(child).id)
    })
    iterator.optional('history', function(child) {
      node.nodes.push(converter.convertElement(child).id)
    })
    iterator.optional('permissions', function(child) {
      node.nodes.push(converter.convertElement(child).id)
    })
    elements = ['self-uri']
      .concat(JATS.RELATED_ARTICLE)
      .concat(JATS.ABSTRACT)
      .concat(['trans-abstract'])
      .concat(JATS.KWD_GROUP)
      .concat(['funding-group', 'conference'])
    iterator.manyOf(elements, function(child) {
      node.nodes.push(converter.convertElement(child).id)
    })
    iterator.optional('counts', function(child) {
      node.nodes.push(converter.convertElement(child).id)
    })
    iterator.optional('custom-meta-group', function(child) {
      node.nodes.push(converter.convertElement(child).id)
    })
    if (iterator.hasNext()) throw new Error('Illegal JATS: ' + el.outerHTML)
  },

  export: function(node, el, converter) {
    el.append(converter.convertNodes(node.nodes))
  }
}
