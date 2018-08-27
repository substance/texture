import { Component } from 'substance'
import renderModelComponent from './renderModelComponent'
import { PREVIEW_MODE, METADATA_MODE, MANUSCRIPT_MODE } from '../ArticleConstants'

// import { FormRowComponent } from '../kit/FormRowComponent'
import NodeModelComponent from './NodeModelComponent'

import PreviewComponent from './PreviewComponent'

export default class FigureComponent extends Component {
  render ($$) {
    const model = this.props.model
    let el = $$('div')
      .addClass('sc-' + model.type)
      .attr('data-id', model.id)
    let mode = this.props.mode || 'manuscript'
    el.addClass(`sm-${mode}`)

    // TODO: this component should listen to label updates
    let label = model.getLabel()

    let contentModel = model.getContent()
    let figureContent = renderModelComponent(this.context, $$, {
      model: contentModel
    }).ref('content').addClass('se-content')
    el.addClass(`sm-${contentModel.type}`)

    if (mode === METADATA_MODE) {
      // el.append(
      //   $$(FormRowComponent, {
      //     label,
      //     issues
      //   }).append(
      //     $$(PropertyEditor, {
      //       label,
      //       model
      //     }).ref(property.name)
      //   )
      // )
      el.append(
        $$(NodeModelComponent, { model })
      )
    } else if (mode === PREVIEW_MODE) {
      el.append(
        $$(PreviewComponent, {
          id: this.props.model.id,
          thumbnail: figureContent,
          label: label
        })
      )
    } else if (mode === MANUSCRIPT_MODE) {
      let labelEl = $$('div').addClass('se-label').text(label)
      el.append(labelEl)
      el.append(figureContent)
      el.append(
        renderModelComponent(this.context, $$, {
          model: model.getTitle(),
          label: 'Title'
        }).ref('title').addClass('se-title')
      )
      el.append(
        renderModelComponent(this.context, $$, {
          model: model.getCaption(),
          label: 'Caption'
        }).ref('caption').addClass('se-caption')
      )
    }

    return el
  }
}
