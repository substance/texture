'use strict';

import TitleComponent from '../title/TitleComponent'

function ArticleTitleComponent() {
  ArticleTitleComponent.super.apply(this, arguments);

}

ArticleTitleComponent.Prototype = function() {
  var _super = ArticleTitleComponent.super.prototype;

  this.render = function() {
    var el = _super.render.apply(this, arguments);
    el.removeClass('sc-title');
    el.addClass('sc-article-title');
    return el;
  };
};

TitleComponent.extend(ArticleTitleComponent);

export default ArticleTitleComponent;