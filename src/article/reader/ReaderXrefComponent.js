import { DefaultDOMElement, NodeComponent } from 'substance'
import { getXrefLabel, getXrefTargets } from '../shared/xrefHelpers'

export default class ReaderXrefComponent extends NodeComponent {

  didMount() {
    super.didMount()
    DefaultDOMElement.getBrowserWindow().on('click', this._showHidePopup, this)
  }

  dispose() {
    super.dispose()
    DefaultDOMElement.getBrowserWindow().off(this)
  }

  getInitialState() {
    return {
      popup: false
    }
  }

  render($$) {
    let node = this.props.node
    let refType = node.getAttribute('ref-type')
    let label = getXrefLabel(node)
    let el = $$('a').addClass('sc-reader-xref sm-'+refType)
      .append(label)
      .on('click', this._togglePopup)

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

  /*
    Render preview only for references.
  */
  _renderBibrPreview($$) {
    let references = this.context.api.getReferences()

    let el = $$('div').addClass('se-preview')
    if(this.state.popup) el.addClass('sm-active')
    let xrefTargets = getXrefTargets(this.props.node)
    xrefTargets.forEach(refId => {
      let label = references.getLabel(refId)
      let html = references.renderReference(refId)
      el.append(
        $$('a').addClass('se-ref')
          .attr({href: '#'+refId})
          .append(
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
    if(this.state.popup) el.addClass('sm-active')
    let xrefTargets = getXrefTargets(this.props.node)
    xrefTargets.forEach(fnId => {
      let label = footnotes.getLabel(fnId)
      let html = footnotes.renderFootnote(fnId)
      el.append(
        $$('a').addClass('se-ref')
          .attr({href: '#'+fnId})
          .append(
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
    if(this.state.popup) el.addClass('sm-active')
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
        $$('a').addClass('se-ref')
          .attr({href: '#'+figId})
          .append(
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
    if(this.state.popup) el.addClass('sm-active')
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
        $$('a').addClass('se-ref')
          .attr({href: '#'+tableId})
          .append(
            $$('div').addClass('se-label').append(label),
            $$('div').addClass('se-figure').append(tableEl)
          ).attr('data-id', tableId)
      )
    })
    return el
  }

  _togglePopup() {
    const popup = this.state.popup
    setTimeout(() => {
      this.extendState({popup: !popup})
    },0)
  }

  _showHidePopup() {
    const popupOpened = this.state.popup
    if(popupOpened) this._togglePopup()
  }
}
