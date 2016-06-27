'use strict';

var last = require('lodash/last');
var oo = require('substance/util/oo');
var JSONConverter = require('substance/model/JSONConverter');
var annotationHelpers = require('substance/model/annotationHelpers');

/*
  EXPERIMENTAL:

    Import:

    Takes the internal model produced by JATSImporter, transforming
    into a simplified representation:
      - flattening sections into HTML style using headings
      - more?

    Export:

    Takes the simplified internal representation and turns it into the
    model that can be used with JATSExporter.

    Challenge:
      Do not loose any information present in JATS (e.g.)

    Delimitation:
      For the time being we do not consider that the Authoring interface
      is used at the same time with the JATS editing interface.
*/

function JATSTransformer() {}

JATSTransformer.Prototype = function() {

  this.fromJATS = function(doc) {
    var jsonConverter = new JSONConverter();
    var json = doc.toJSON();
    var converted = doc.newInstance();
    jsonConverter.importDocument(converted, json);

    var body = doc.get('body');
    var nodes = body.getNodes();

    var nodeIds = _flattenSections(converted, nodes, [], 1);
    converted.create({
      id: 'bodyFlat',
      type: 'container',
      nodes: nodeIds
    });
    return converted;
  };

  function _flattenSections(doc, nodes, result, level) {
    nodes.forEach(function(node) {
      if (node.type === 'section') {
        var id = 'h_' + node.id;
        var titleId = node.title;
        doc.create({
          id: id,
          type: 'heading',
          sectionId: node.id,
          level: level,
          content: node.getTitle(),
        });
        if (titleId) {
          annotationHelpers.transferAnnotations(doc, [titleId, 'content'], 0, [id, 'content'], 0);
        }
        result.push(id);
        _flattenSections(doc, node.getNodes(), result, level+1);
        result = result.concat(node.backMatter);
      }
    });
    return result;
  }

  this.toJATS = function(doc) {
    var jsonConverter = new JSONConverter();
    var json = doc.toJSON();
    var converted = doc.newInstance();
    jsonConverter.importDocument(converted, json);

    var body = converted.get('bodyFlat');
    var nodeIds = _createSections(converted, body.getNodes());
    converted.create({
      id: 'body',
      nodes: nodeIds
    });
    return converted;
  };

  var _isSectionBackMatter = {
    "notes": true,
    "fn-group": true,
    "glossary": true,
    "ref-list": true
  };

  function _createSections(doc, nodes) {
    var stack = [{
      nodes: [],
      backMatter: []
    }];
    for (var i=0; i < nodes.length; i++) {
      var node = nodes[i];
      if (node.type === 'heading') {
        if (node.level <= stack.length - 1) {
          for (var j = stack.length - 2; j >= node.level; j--) {
            var item = stack[j];
            var title = doc.create({
              type: 'title',
              content: item.node.getText(),
            });
            annotationHelpers.transferAnnotations(doc, item.node.getTextPath(), 0, title.getTextPath(), 0);
            doc.create({
              type: 'section',
              title: title.id,
              nodes: item.nodes,
              backMatter: item.backMatter
            });
          }
        } else {
          stack.push({
            nodes: [],
            backMatter: [],
          });
        }
      } else if (_isSectionBackMatter[node.type]) {
        last(stack).backMatter.push(node.id);
      } else {
        last(stack).nodes.push(node.id);
      }
    }
    if (stack.length !== 1) {
      // if this occurs we have a bug above
      throw new Error("Illegal state.");
    }
    return stack[0].nodes;
  }
};

oo.initClass(JATSTransformer);

module.exports = JATSTransformer;
