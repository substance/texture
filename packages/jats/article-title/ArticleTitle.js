'use strict';

import { TextNode } from 'substance'

function ArticleTitle() {
  ArticleTitle.super.apply(this, arguments);
}

TextNode.extend(ArticleTitle);

ArticleTitle.type = 'article-title';

ArticleTitle.define({
  attributes: { type: 'object', default: {} },
});

export default ArticleTitle;