import { Component } from 'substance'
import renderModelComponent from './renderModelComponent'
import { PREVIEW_MODE, METADATA_MODE } from '../ArticleConstants'
import FigureMetadataComponent from './FigureMetadataComponent'
import PreviewComponent from './PreviewComponent'

export default class FigureComponent extends Component {
  render ($$) {
    const model = this.props.model
    let mode = this.props.mode || 'manuscript'

    // delegating to a implementation in case of 'metadata'
    if (mode === METADATA_MODE) {
      return $$(FigureMetadataComponent, { model })
    }

    let el = $$('div')
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
      el.append(
        $$(PreviewComponent, {
          id: this.props.model.id,
          thumbnail: figureContent,
          label
        })
      )
    } else {
      let labelEl = $$('div').addClass('se-label').text(label)
      el.append(labelEl)
      el.append(figureContent)
      el.append(
        renderModelComponent(this.context, $$, {
          model: model.getTitle(),
          label: this.getLabel('title')
        }).ref('title').addClass('se-title')
      )
      el.append(
        renderModelComponent(this.context, $$, {
          model: model.getCaption(),
          label: this.getLabel('caption')
        }).ref('caption').addClass('se-caption')
      )
    }

    return el
  }
}
