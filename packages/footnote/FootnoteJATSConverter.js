'use strict';

module.exports = {

  type: 'footnote',
  tagName: 'fn',
  allowedContext: [
    'abbrev', 'abbrev-journal-title', 'addr-line', 'aff', 'alt-title', 'anonymous',
    'article-title', 'attrib', 'author-notes', 'award-id', 'bold', 'chapter-title',
    'chem-struct', 'code', 'collab', 'comment', 'compound-kwd-part', 'conf-acronym',
    'conf-loc', 'conf-name', 'conf-num', 'conf-sponsor', 'conf-theme', 'contrib',
    'contrib-group', 'copyright-statement', 'corresp', 'def-head', 'degrees',
    'disp-formula', 'edition', 'element-citation', 'email', 'etal', 'ext-link',
    'fax', 'fixed-case', 'fn-group', 'funding-source', 'funding-statement',
    'given-names', 'gov', 'history', 'inline-formula', 'inline-supplementary-material',
    'institution', 'issue', 'issue-part', 'issue-sponsor', 'issue-title', 'italic',
    'journal-subtitle', 'journal-title', 'kwd', 'label', 'license-p', 'meta-name',
    'meta-value', 'mixed-citation', 'monospace', 'named-content', 'on-behalf-of',
    'overline', 'p', 'part-title', 'patent', 'phone', 'prefix', 'preformat', 'product',
    'publisher-loc', 'publisher-name', 'rb', 'related-article', 'related-object',
    'role', 'roman', 'sans-serif', 'sc', 'self-uri', 'series', 'series-text',
    'series-title', 'sig', 'sig-block', 'source', 'speaker', 'std-organization',
    'strike', 'string-conf', 'string-date', 'string-name', 'styled-content', 'sub',
    'subject', 'subtitle', 'suffix', 'sup', 'supplement', 'surname', 'table-wrap-foot',
    'target', 'td', 'term', 'term-head', 'th', 'title', 'trans-source', 'trans-subtitle',
    'trans-title', 'underline', 'unstructured-kwd-group', 'uri', 'verse-line', 'version',
    'volume', 'volume-id', 'volume-series', 'xref'
  ],

  /*
    Spec: http://jats.nlm.nih.gov/archiving/tag-library/1.1/element/fig.html

    Attributes
      fn-type Type of Footnote
      id Document Internal Identifier
      specific-use Specific Use
      symbol Symbol
      xml:base Base
      xml:lang Language

    Content
      (label?, (p)+)
  */

  import: function(el, node, converter) {
    node.xmlAttributes = el.getAttributes();
    var children = el.getChildren();
    children.forEach(function(childEl) {
      var tagName = childEl.tagName;
      switch (tagName) {
        case 'label':
          node.label = converter.annotatedText(childEl, [node.id, 'label']);
          break;
        case 'p':
          node.contentNodes.push(converter.convertElement(childEl).id);
          break;
        default:
          console.warn('Unhandled element <%s> in <fig>.', tagName);
          node.contentNodes.push(converter.convertElement(childEl).id);
      }
    });
  },

  export: function(node, el, converter) {
    var $$ = converter.$$;
    if (node.label) {
      el.append(converter.annotatedText([node.id, 'label']));
    }
    el.append(converter.convertNodes(node.contentNodes));
  }

};
