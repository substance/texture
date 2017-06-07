import JATS from '../JATS'
import XMLIterator from '../../util/XMLIterator'

let ACCESS_OR_LINK = JATS.ACCESS.concat(JATS.ADDRESS_LINK)
let FIGURE_CONTENT = JATS.BLOCK_MATH
  .concat(JATS.CHEM_STRUCT)
  .concat(JATS.INTABLE_PARA)
  .concat(JATS.JUST_TABLE)
  .concat(JATS.JUST_PARA)
  .concat(JATS.LIST)
  .concat(JATS.SIMPLE_DISPLAY)

export default {

  type: 'figure',
  tagName: 'fig',

  /*
    Spec: http://jats.nlm.nih.gov/archiving/tag-library/1.1/element/fig.html

    Attributes
      fig-type Type of Figure
      id Document Internal Identifier
      orientation Orientation
      position Position
      specific-use Specific Use
      xml:base Base
      xml:lang Language

    Content
    (
      (object-id)*,
      label?, (caption)*, (abstract)*, (kwd-group)*,
      (alt-text | long-desc | email | ext-link | uri)*,
      (disp-formula | disp-formula-group | chem-struct-wrap | disp-quote | speech |
        statement | verse-group | table-wrap | p | def-list | list | alternatives |
        array | code | graphic | media | preformat)*,
      (attrib | permissions)*
    )
  */

  import: function(el, node, converter) {
    let iterator = new XMLIterator(el.getChildren())
    iterator.manyOf('object-id', function(child) {
      node.objectIds.push(child.textContent)
    })
    iterator.optional('label', function(child) {
      node.label = converter.convertElement(child).id
    })
    iterator.manyOf('caption', function(child) {
      node.captions.push(converter.convertElement(child).id)
    })
    iterator.manyOf('abstract', function(child) {
      node.abstracts.push(converter.convertElement(child).id)
    })
    iterator.manyOf('kwd-group', function(child) {
      node.kwdGroups.push(converter.convertElement(child).id)
    })
    iterator.manyOf(ACCESS_OR_LINK, function(child) {
      let childNode = converter.convertElement(child)
      switch(child.tagName) {
        case "alt-text":
          node.altTexts.push(childNode.id)
          break
        case "long-desc":
          node.longDescs.push(childNode.id)
          break
        case "ext-link":
          node.extLinks.push(childNode.id)
          break
        case "uri":
          node.uris.push(childNode.id)
          break
        case "email":
          node.emails.push(childNode.id)
          break
        default:
          //nothing
      }
    })
    iterator.manyOf(FIGURE_CONTENT, function(child) {
      node.contentNodes.push(converter.convertElement(child).id)
    })
    iterator.manyOf(JATS.DISLAY_BACK_MATTER, function(child) {
      var childNode = converter.convertElement(child)
      switch(child.tagName) {
        case "attrib":
          node.attribs.push(childNode.id)
          break
        case "permissions":
          node.permissions.push(childNode.id)
          break
        default:
          //nothing
      }
    })
    if (iterator.hasNext()) {
      throw new Error('Illegal JATS: ' + el.outerHTML)
    }
  },

  export: function(node, el, converter) {
    let $$ = converter.$$
    node.objectIds.forEach(function(objectId) {
      el.append($$('object-id').text(objectId))
    })
    if (node.label) {
      el.append(converter.convertNode(node.label))
    }
    el.append(converter.convertNodes(node.captions))
    el.append(converter.convertNodes(node.abstracts))
    el.append(converter.convertNodes(node.kwdGroups))
    if (node.altTexts) {
      el.append(converter.convertNodes(node.altTexts))
    }
    if (node.longDescs) {
      el.append(converter.convertNodes(node.longDescs))
    }
    if (node.extLinks) {
      el.append(converter.convertNodes(node.extLinks))
    }
    if (node.uris) {
      el.append(converter.convertNodes(node.uris))
    }
    if (node.emails) {
      el.append(converter.convertNodes(node.emails))
    }
    el.append(converter.convertNodes(node.contentNodes))
    el.append(converter.convertNodes(node.attribs))
    el.append(converter.convertNodes(node.permissions))
  }
}
