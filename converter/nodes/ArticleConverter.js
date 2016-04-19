'use strict';

module.exports = {

  type: 'article',
  tagName: 'article',

  /*
    Attributes
      article-type Type of Article
      dtd-version Version of the Tag Set (DTD)
      id Document Internal Identifier
      specific-use Specific Use
      xml:base Base
      xml:lang Language
      xmlns:ali NISO ALI Namespace (NISO Access License and Indicators)
      xmlns:mml MathML Namespace Declaration
      xmlns:xlink XLink Namespace Declaration
      xmlns:xsi XML Schema Namespace Declaration

    Content Model
      (front, body?, back?, floats-group?, (sub-article* | response*))
  */

  import: function(el, node, converter) {
    node.id = this.tagName;
    var childNodes = el.getChildNodes();
    childNodes.forEach(function(childEl) {
      var tagName = childEl.tagName;
      var child = converter.convertElement(childEl);
      switch(tagName) {
        case 'front':
          node.front = child.id;
          break;
        case 'body':
          node.body = child.id;
          break;
        case 'back':
          node.back = child.id;
          break;
        case 'floats-group':
          node.floatsGroup = child.id;
          break;
        case 'sub-article':
          if (!node.subArticles) {
            node.subArticles = [];
          }
          node.subArticles.push(child.id);
          break;
        case 'response':
          if (!node.responses) {
            node.responses = [];
          }
          node.responses.push(child.id);
          break;
        default:
          throw new Error('Illegal <article> content element: ' + tagName);
      }
    });
  },

  export: function(node, el, converter) {
    el.append(converter.convertNode(node.front));
    if (node.body) {
      el.append(converter.convertNode(node.body));
    }
    if (node.back) {
      el.append(converter.convertNode(node.back));
    }
    if (node.floatsGroup) {
      el.append(converter.convertNode(node.floatsGroup));
    }
    if (node.subArticles) {
      node.subArticles.forEach(function(subArticle) {
        el.append(converter.convertNode(subArticle));
      });
    }
    if (node.responses) {
      node.responses.forEach(function(response) {
        el.append(converter.convertNode(response));
      });
    }
  }

};
