import { Component } from 'substance'
import renderModelComponent from './renderModelComponent'
import { PREVIEW_MODE, METADATA_MODE, MANUSCRIPT_MODE } from '../ArticleConstants'

import PreviewComponent from './PreviewComponent'

export default class FigureComponent extends Component {
  render ($$) {
    const model = this.props.model
    let el = $$('div')
      .addClass('sc-' + model.type)
      .attr('data-id', model.id)
    let mode = this.props.mode || 'manuscript'
    el.addClass(`sm-${mode}`)

    // CHALLENGE: this should be rendered as readonly
    // Furthermore, ATM we use the node.state to store generated labels
    // as they are volatile. Thus, this component should observe changes to the node state and rerender on change.
    let label = model.getLabel()
    let figureContent = renderModelComponent(this.context, $$, {
      model: model.getContent()
    }).ref('content').addClass('se-content')

    if (mode === METADATA_MODE) {
      el.append('FIGURE METADATA EDITION')
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
