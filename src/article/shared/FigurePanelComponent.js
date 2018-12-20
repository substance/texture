import { Component } from 'substance'
import { PREVIEW_MODE, METADATA_MODE } from '../ArticleConstants'
import FigureMetadataComponent from './FigureMetadataComponent'
import PreviewComponent from './PreviewComponent'
import renderModelComponent from './renderModelComponent'

export default class FigurePanelComponent extends Component {
  didMount () {
    // HACK: while this is an idiomatic approach to updating, I don't like it because we just need this to receive updates for labels
    // which are propagated via node state
    // TODO: instead we should use a Component for the label which is binding itself to the state update
    let mode = this._getMode()
    if (mode !== METADATA_MODE) {
      this.context.appState.addObserver(['document'], this.rerender, this, { stage: 'render', document: { path: [this.props.model.id] } })
    }
  }

  dispose () {
    this.context.appState.removeObserver(this)
  }

  render ($$) {
    const model = this.props.model
    let mode = this._getMode()

    // delegating to a implementation in case of 'metadata'
    if (mode === METADATA_MODE) {
      return $$(FigureMetadataComponent, { model }).ref('metadata')
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
    }

    return el
  }

  _getMode () {
    return this.props.mode || 'manuscript'
  }
}
