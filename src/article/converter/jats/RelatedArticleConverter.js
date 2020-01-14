export default class RelatedArticleConverter {
  get type() {
    return 'related-article';
  }

  get tagName() {
    return 'related-article';
  }

  import(el, node) {
    let extLinkType = el.getAttribute('ext-link-type');
    if (extLinkType) {
      node.linkType = extLinkType;
    }

    let id = el.getAttribute('id');
    if (id) {
      node.id = id;
    }

    let relatedArticleType = el.getAttribute('related-article-type');
    if (relatedArticleType) {
      node.relatedArticleType = relatedArticleType;
    }

    let href = el.getAttribute('xlink:href');
    if (href) {
      node.href = href;
    }
  }

  export(node, el) {
    if (node.linkType) {
      el.setAttribute('ext-link-type', node.linkType);
    }

    if (node.id) {
      el.setAttribute('id', node.id);
    }

    if (node.relatedArticleType) {
      el.setAttribute('related-article-type', node.relatedArticleType);
    }

    if (node.href) {
      el.setAttribute('xlink:href', node.href);
    }
  }
}
