import { Component } from 'substance'
import { createValueModel } from '../../kit'
import MetadataCollectionComponent from './MetadataCollectionComponent'
import { METADATA_MODE } from '../ArticleConstants'
import CardComponent from '../shared/CardComponent'

// NOTE: We use a special component to render Figures in the Metadata view.
// Every Figure can be seen as a collection of sub-figure (aka panels), and
// every panel is rendered as individual card.
export default class FiguresSectionComponent extends Component {
  render ($$) {
    const model = this.props.model
    const figures = model.getItems()
    let el = $$('div').addClass('sc-collection-editor')
    for (let figure of figures) {
      el.append(
        $$(FigurePanelsComponent, { model: createValueModel(this.context.api, [figure.id, 'panels']) }).ref(figure.id)
      )
    }
    return el
  }
}

// This component takes a collection of panels (figure.getPanels())
// and renders every item in an individual card
class FigurePanelsComponent extends MetadataCollectionComponent {
  render ($$) {
    const panels = this.props.model.getItems()
    let el = $$('div')
    for (let panel of panels) {
      let PanelEditor = this._getItemComponentClass(panel)
      el.append(
        $$(CardComponent, {
          node: panel,
          label: 'figure'
        }).append(
          $$(PanelEditor, {
            mode: METADATA_MODE,
            node: panel
          }).ref(panel.id)
        )
      )
    }
    return el
  }

  didMount () {
    let path = this.props.model.getPath()
    this.context.appState.addObserver(['document'], this.rerender, this, {
      stage: 'render',
      document: { path }
    })
  }

  dispose () {
    this.context.appState.removeObserver(this)
  }
}
