export default class FigureConverter {
  get type () { return 'figure' }

  // ATTENTION: this converter will create either a <fig> or a <fig-group>
  // element depending on the number of Figure panels
  get tagName () { return 'figure' }

  matchElement (el, importer) {
    if (el.is('fig') || el.is('fig-group')) {
      // Note: do not use this converter if we are already converting a figure
      let context = importer.state.getCurrentContext()
      return context && context.converter !== this
    } else {
      return false
    }
  }

  import (el, node, importer) {
    // single panel figure
    let panelIds = []
    if (el.is('fig')) {
      let panel = importer.convertElement(el)
      panelIds.push(panel.id)
    // multi-panel figure
    } else if (el.is('fig-group')) {
      panelIds = el.findAll('fig').map(child => importer.convertElement(child).id)
    }
    node.panels = panelIds
  }

  export (node, el, exporter) {
    let doc = exporter.getDocument()
    if (node.panels.length === 1) {
      return exporter.convertNode(doc.get(node.panels[0]))
    } else {
      el.tagName = 'fig-group'
      el.attr('id', node.id)
      el.append(node.panels.map(id => exporter.convertNode(doc.get(id))))
      return el
    }
  }
}
