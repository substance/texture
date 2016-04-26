'use strict';

module.exports = {

  type: "link",
  tagName: "ext-link",

  allowedContext: [
    'abbrev', 'abbrev-journal-title', 'address', 'addr-line', 'aff', 'alt-title',
    'anonymous', 'array', 'article-meta', 'article-title', 'attrib', 'award-id',
    'bold', 'chapter-title', 'chem-struct', 'chem-struct-wrap', 'code', 'collab',
    'comment', 'compound-kwd-part', 'conf-acronym', 'conf-loc', 'conf-name',
    'conf-num', 'conf-sponsor', 'conf-theme', 'contrib', 'contrib-group',
    'copyright-statement', 'corresp', 'data-title', 'def-head', 'degrees',
    'disp-formula', 'disp-formula-group', 'edition', 'element-citation', 'email',
    'etal', 'ext-link', 'fax', 'fig', 'fig-group', 'fixed-case', 'front-stub',
    'funding-source', 'funding-statement', 'given-names', 'gov', 'graphic', 'history',
    'inline-formula', 'inline-supplementary-material', 'institution', 'issue',
    'issue-part', 'issue-sponsor', 'issue-title', 'italic', 'journal-subtitle',
    'journal-title', 'kwd', 'label', 'license-p', 'media', 'meta-name', 'meta-value',
    'mixed-citation', 'monospace', 'named-content', 'on-behalf-of', 'overline', 'p',
    'part-title', 'patent', 'phone', 'prefix', 'preformat', 'product', 'publisher-loc',
    'publisher-name', 'rb', 'related-article', 'related-object', 'role', 'roman',
    'sans-serif', 'sc', 'self-uri', 'series', 'series-text', 'series-title', 'sig',
    'sig-block', 'source', 'speaker', 'std-organization', 'strike', 'string-conf',
    'string-date', 'string-name', 'styled-content', 'sub', 'subject', 'subtitle',
    'suffix', 'sup', 'supplement', 'supplementary-material', 'surname', 'table-wrap',
    'table-wrap-group', 'target', 'td', 'term', 'term-head', 'th', 'title',
    'trans-source', 'trans-subtitle', 'trans-title', 'underline',
    'unstructured-kwd-group', 'uri', 'verse-line', 'version', 'volume', 'volume-id',
    'volume-series', 'xref'
  ],

  /*
    Attributes
    assigning-authority Authority Responsible for an Identifier
    ext-link-type Type of External Link
    id Document Internal Identifier
    specific-use Specific Use
    xlink:actuate Actuating the Link
    xlink:href Href (Linking Mechanism)
    xlink:role Role of the Link
    xlink:show Showing the Link
    xlink:title Title of the Link
    xlink:type Type of Link
    xml:base Base
    xml:lang Language
    xmlns:xlink XLink Namespace Declaration

    Content
    (#PCDATA | email | ext-link | uri | inline-supplementary-material |
      related-article | related-object | hr | bold | fixed-case | italic |
      monospace | overline | overline-start | overline-end | roman | sans-serif
      | sc | strike | underline | underline-start | underline-end | ruby |
      alternatives | inline-graphic | private-char | chem-struct | inline-formula |
      tex-math | mml:math | abbrev | milestone-end | milestone-start | named-content |
      styled-content | fn | target | xref | sub | sup | x)*
  */

  import: function(el, node) {
    // ATTENTION: this is not implemented correctly yet
    node.xmlAttributes = el.getAttributes();
    node.url = el.attr('xlink:href');
    node.title = el.attr('xlink:title');
  },

  export: function(node, el) {
    // ATTENTION: this is not implemented correctly yet
    el.attr(node.xmlAttributes);
    el.attr({
      'xlink:href': node.url,
      'xlink:title': node.title
    });
  }
};

