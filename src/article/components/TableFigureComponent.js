import { $$ } from 'substance'
import FigureComponent from './FigureComponent'
import LabelComponent from './LabelComponent'

/**
 * A TableFigure is similar to a figure but has only one panel, and a table as content.
 * Additionally it can contain footnotes.
 */
export default class TableFigureComponent extends FigureComponent {
  _getClassNames () {
    return `sc-table-figure`
  }

  _renderManuscriptVersion () {
    const mode = this._getMode()
    const node = this.props.node
    const SectionLabel = this.getComponent('section-label')

    let el = $$('div')
      .addClass(this._getClassNames())
      .attr('data-id', node.id)
      .addClass(`sm-${mode}`)
      .addClass()

    el.append(
      $$(SectionLabel, { label: this.getLabel('label-label') }),
      $$(LabelComponent, { node }),
      // no label for the graphic
      this._renderContent(),
      $$(SectionLabel, { label: this.getLabel('title-label') }),
      this._renderValue('title', { placeholder: this.getLabel('title-placeholder') }).addClass('se-title'),
      $$(SectionLabel, { label: this.getLabel('legend-label') }),
      this._renderValue('legend', { name: 'legend', placeholder: this.getLabel('legend-placeholder') }).addClass('se-legend')
    )

    // FIXME: does not react to node.footnotes changes
    if (node.footnotes.length > 0) {
      el.append(
        $$(SectionLabel, { label: this.getLabel('footnotes-label') }),
        this._renderValue('footnotes').ref('footnotes').addClass('se-footnotes')
      )
    }

    return el
  }
}
