import XMLIterator from '../../util/XMLIterator'

let CONTRIB_GROUP = ['contrib', 'address', 'aff', 'aff-alternatives', 'author-comment', 'bio', 'email', 'etal', 'ext-link', 'fn', 'on-behalf-of', 'role', 'uri', 'xref', 'x']

export default {

  type: 'contrib-group',
  tagName: 'contrib-group',

  import: function(el, node, converter) {
    // node.id = 'contrib-group'; // there is only be one body element
    node.xmlAttributes = el.getAttributes()

    let children = el.getChildren()
    let iterator = new XMLIterator(children)

    iterator.oneOrMoreOf(CONTRIB_GROUP, function(child) {
      node.nodes.push(converter.convertElement(child).id)
    })
    if (iterator.hasNext()) throw new Error('Illegal JATS: ' + el.outerHTML)
  },

  export: function(node, el, converter) {
    el.attr(node.xmlAttributes)
    el.append(converter.convertNodes(node.nodes))
    if (node.sigBlock) {
      el.append(converter.convertNode(node.sigBlock))
    }
  }

}
