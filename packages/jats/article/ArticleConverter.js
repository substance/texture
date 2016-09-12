import XMLIterator from '../../../util/XMLIterator'

export default {

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
      front, body?, back?, floats-group?, (sub-article* | response*)
  */

  import: function(el, node, converter) {
    node.id = 'article'; // there is only be one article element

    var children = el.getChildren();
    var iterator = new XMLIterator(children);
    iterator.required('front', function(child) {
      node.front = converter.convertElement(child).id;
    });
    iterator.optional('body', function(child) {
      node.body = converter.convertElement(child).id;
    });
    iterator.optional('back', function(child) {
      node.back = converter.convertElement(child).id;
    });
    iterator.optional('floats-group', function(child) {
      node.floatsGroup = converter.convertElement(child).id;
    });
    iterator.manyOf('sub-article', function(child) {
      if (!node.subArticles) node.subArticles = [];
      node.subArticles.push(converter.convertElement(child).id);
    });
    iterator.manyOf('response', function(child) {
      if (!node.responses) node.responses = [];
      node.responses.push(converter.convertElement(child).id);
    });
    if (iterator.hasNext()) {
      throw new Error('Illegal JATS: ' + el.outerHTML);
    }
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
      el.append(converter.convertNodes(node.subArticles));
    }
    if (node.responses) {
      el.append(converter.convertNodes(node.responses));
    }
  }
};
