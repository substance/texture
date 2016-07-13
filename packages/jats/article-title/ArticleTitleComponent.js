'use strict';

var TitleComponent = require('../title/TitleComponent');

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

module.exports = ArticleTitleComponent;