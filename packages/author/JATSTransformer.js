import last from 'lodash/last'
import JSONConverter from 'substance/model/JSONConverter'
import annotationHelpers from 'substance/model/annotationHelpers'

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

class JATSTransformer {

  fromJATS(doc) {
    let jsonConverter = new JSONConverter()
    let json = doc.toJSON()
    let converted = doc.newInstance()
    jsonConverter.importDocument(converted, json)

    let body = doc.get('body')
    let nodes = body.getNodes()

    let nodeIds = _flattenSections(converted, nodes, [], 1)
    converted.create({
      id: 'bodyFlat',
      type: 'body',
      nodes: nodeIds
    })
    return converted
  }

  toJATS(doc) {
    let jsonConverter = new JSONConverter()
    let json = doc.toJSON()
    let converted = doc.newInstance()
    jsonConverter.importDocument(converted, json)

    let body = converted.get('bodyFlat')
    let nodeIds = _createSections(converted, body.getNodes())
    if (converted.get('body')) {
      converted.set(['body', 'nodes'], nodeIds)
    } else {
      converted.create({
        id: 'body',
        type: 'body',
        nodes: nodeIds
      })
    }
    return converted
  }

}

export default JATSTransformer


/* internals */

let _isSectionBackMatter = {
  "notes": true,
  "fn-group": true,
  "glossary": true,
  "ref-list": true
}

function _flattenSections(doc, nodes, result, level) {
  nodes.forEach(function(node) {
    if (node.type === 'section') {
      let id = 'h_' + node.id
      let titleId = node.title
      doc.create({
        id: id,
        type: 'heading',
        sectionId: node.id,
        level: level,
        content: node.getTitle(),
      })
      if (titleId) {
        annotationHelpers.transferAnnotations(doc, [titleId, 'content'], 0, [id, 'content'], 0)
      }
      result.push(id)
      result = _flattenSections(doc, node.getNodes(), result, level+1)
      result = result.concat(node.backMatter)
    } else {
      result.push(node.id)
    }
  })
  return result
}

function _createSections(doc, nodes) {
  let stack = [{
    nodes: [],
    backMatter: []
  }]

  function _createSection(item) {
    let title = doc.create({
      type: 'title',
      content: item.node.getText(),
    })
    annotationHelpers.transferAnnotations(doc, item.node.getTextPath(), 0, title.getTextPath(), 0)
    return doc.create({
      type: 'section',
      title: title.id,
      nodes: item.nodes,
      backMatter: item.backMatter
    })
  }
  let item, sec
  for (let i=0; i < nodes.length; i++) {
    let node = nodes[i]
    if (node.type === 'heading') {
      while (stack.length >= node.level+1) {
        item = stack.pop()
        sec = _createSection(item)
        last(stack).nodes.push(sec.id)
      }
      stack.push({
        node: node,
        nodes: [],
        backMatter: [],
      })
    } else if (_isSectionBackMatter[node.type]) {
      last(stack).backMatter.push(node.id)
    } else {
      last(stack).nodes.push(node.id)
    }
  }
  while (stack.length > 1) {
    item = stack.pop()
    sec = _createSection(item)
    last(stack).nodes.push(sec.id)
  }
  return stack[0].nodes
}
