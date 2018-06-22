import { NodeComponent } from 'substance'
import { getXrefLabel, getXrefTargets } from '../../editor/util/xrefHelpers'

export default class ReaderXrefComponent extends NodeComponent {

  render($$) {
    let node = this.props.node
    let refType = node.getAttribute('ref-type')
    let el = this._renderLabel($$, node)

    // Add a preview if refType is bibr
    if (refType === 'bibr') {
      el.append(
        this._renderBibrPreview($$)
      )
    } else if (refType === 'fn') {
      el.append(
        this._renderFnPreview($$)
      )
    } else if (refType === 'fig') {
      el.append(
        this._renderFigPreview($$)
      )
    } else if (refType === 'table') {
      el.append(
        this._renderTablePreview($$)
      )
    }
    return el
  }

  _renderLabel($$, node) {
    const refType = node.getAttribute('ref-type')
    const label = getXrefLabel(node)
    const xrefTargets = getXrefTargets(node)
    // For now we will use a link to the first reference
    const refLink = xrefTargets[0]
    return $$('a').addClass('sc-reader-xref sm-'+refType)
      .attr('href','#' + refLink)
      .append(label)
  }
  /*
    Render preview only for references.
  */
  _renderBibrPreview($$) {
    let references = this.context.api.getReferences()

    let el = $$('div').addClass('se-preview')
    let xrefTargets = getXrefTargets(this.props.node)
    xrefTargets.forEach(refId => {
      let label = references.getLabel(refId)
      let html = references.renderReference(refId)
      el.append(
        $$('div').addClass('se-ref').append(
          $$('div').addClass('se-label').append(label),
          $$('div').addClass('se-text').html(html)
        ).attr('data-id', refId)
      )
    })
    return el

  }

  /*
    Render preview for footnotes.
  */
  _renderFnPreview($$) {
    let footnotes = this.context.api.getFootnotes()
    let el = $$('div').addClass('se-preview')
    let xrefTargets = getXrefTargets(this.props.node)
    xrefTargets.forEach(fnId => {
      let label = footnotes.getLabel(fnId)
      let html = footnotes.renderFootnote(fnId)
      el.append(
        $$('div').addClass('se-ref').append(
          $$('div').addClass('se-label').append(label),
          $$('div').addClass('se-text').html(html)
        ).attr('data-id', fnId)
      )
    })
    return el
  }

  /*
    Render preview for figures.
  */
  _renderFigPreview($$) {
    const doc = this.context.doc
    const api = this.context.api
    const urlResolver = this.context.urlResolver
    let el = $$('div').addClass('se-preview')
    let xrefTargets = getXrefTargets(this.props.node)
    xrefTargets.forEach(figId => {
      const node = doc.get(figId)
      const figure = api.getModel(node)
      const label = figure.getLabel()
      const content = figure.getContent()
      let url = content.getAttribute('xlink:href')
      if (urlResolver) {
        url = urlResolver.resolveUrl(url)
      }
      el.append(
        $$('div').addClass('se-ref').append(
          $$('div').addClass('se-label').append(label),
          $$('div').addClass('se-figure').append(
            $$('img').attr({src: url})
          )
        ).attr('data-id', figId)
      )
    })
    return el
  }

  /*
    Render preview for tables.
  */
  _renderTablePreview($$) {
    const doc = this.context.doc
    const api = this.context.api
    let el = $$('div').addClass('se-preview')
    let xrefTargets = getXrefTargets(this.props.node)
    xrefTargets.forEach(tableId => {
      const node = doc.get(tableId)
      const table = api.getModel(node)
      const label = table.getLabel()
      const content = table.getContent()
      const matrix = content.getCellMatrix()
      const tableEl = $$('table')
      for (let i = 0; i < matrix.length; i++) {
        let cells = matrix[i]
        let tr = $$('tr')
        for (let j = 0; j < cells.length; j++) {
          if (cells[j].shadowed) continue
          let cell = cells[j]
          let cellType = cell.attr('heading') ? 'th' : 'td'
          tr.append(
            $$(cellType).append(cell.getText())
          )
        }
        tableEl.append(tr)
      }

      el.append(
        $$('div').addClass('se-ref').append(
          $$('div').addClass('se-label').append(label),
          $$('div').addClass('se-figure').append(
            tableEl
          )
        ).attr('data-id', tableId)
      )
    })
    return el
  }
}
