'use strict';

module.exports = {

  type: "reference",
  tagName: "xref",

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

  /* <xref ref-type="bibr" rid="bib50">Steppuhn and Baldwin, 2007</xref> */

  import: function(el, node) {
    node.xmlAttributes = el.getAttributes();
    node.target = el.attr('rid');
    node.label = el.textContent;
    node.referenceType = el.attr('ref-type');
  },

  export: function(node, el) {
    // TODO: export xmlAttributes
    el.attr(node.xmlAttributes);
    el.attr({
      'ref-type': node.referenceType,
      'rid': node.target
    });
  }
};

