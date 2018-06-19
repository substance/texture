import { NodeComponent } from 'substance'
import { getXrefLabel, getXrefTargets } from '../../editor/util/xrefHelpers'

export default class ReaderXrefComponent extends NodeComponent {

  render($$) {
    let node = this.props.node
    let refType = node.getAttribute('ref-type')
    let label = getXrefLabel(node)
    let el = $$('span').addClass('sc-reader-xref sm-'+refType).append(label)
    // Add a preview if refType is bibr
    if (refType === 'bibr') {
      el.append(
        this._renderPreview($$)
      )
    } else if (refType === 'fn') {
      el.append(
        this._renderFnPreview($$)
      )
    }
    return el
  }

  /*
    Render preview only for references.
  */
  _renderPreview($$) {
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
}
