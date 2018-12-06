import { PREVIEW_MODE, METADATA_MODE } from '../ArticleConstants'
import TableFigureMetadataComponent from './TableFigureMetadataComponent'
import PreviewComponent from './PreviewComponent'
import renderModelComponent from './renderModelComponent'

import FigureComponent from './FigureComponent'

export default class TableFigureComponent extends FigureComponent {
  render ($$) {
    const model = this.props.model
    let mode = this._getMode()

    // delegating to a implementation in case of 'metadata'
    if (mode === METADATA_MODE) {
      return $$(TableFigureMetadataComponent, { model }).ref('metadata')
    }

    let el = $$('div')
      // TODO: don't violate the 'sc-' contract
      .addClass('sc-' + model.type)
      .attr('data-id', model.id)
    el.addClass(`sm-${mode}`)

    // TODO: this component should listen to label updates
    let label = model.getLabel()
    let contentModel = model.getContent()
    let figureContent = renderModelComponent(this.context, $$, {
      model: contentModel
    }).ref('content').addClass('se-content')
    el.addClass(`sm-${contentModel.type}`)

    if (mode === PREVIEW_MODE) {
      // TODO: We could return the PreviewComponent directly.
      // However this yields an error we need to investigate.
      el.append(
        $$(PreviewComponent, {
          id: this.props.model.id,
          thumbnail: contentModel.type === 'graphic' ? figureContent : undefined,
          label
        })
      )
    } else {
      const SectionLabel = this.getComponent('section-label')
      const FootnoteComponent = this.getComponent('fn')
      const footnotes = this._getFootnotes()

      let labelEl = $$('div').addClass('se-label').text(label)
      el.append(
        $$(SectionLabel, {label: 'label-label'}),
        labelEl,
        figureContent,
        $$(SectionLabel, {label: 'title-label'}),
        renderModelComponent(this.context, $$, {
          model: model.getTitle(),
          label: this.getLabel('title')
        }).ref('title').addClass('se-title'),
        $$(SectionLabel, {label: 'caption-label'}),
        renderModelComponent(this.context, $$, {
          model: model.getCaption(),
          label: this.getLabel('caption')
        }).ref('caption').addClass('se-caption')
      )

      if (footnotes.length > 0) {
        const footnotesEl = $$('div').addClass('se-table-figure-footnotes')
        footnotes.forEach(model => {
          let node = model._node
          footnotesEl.append(
            $$(FootnoteComponent, { model, node }).ref(model.id)
          )
        })
        el.append(
          $$(SectionLabel, {label: 'footnotes-label'}),
          footnotesEl
        )
      }
    }

    return el
  }

  _getFootnotes () {
    let model = this.props.model
    let footnotes = model.getFootnotes()
    return footnotes.getItems()
  }
}
