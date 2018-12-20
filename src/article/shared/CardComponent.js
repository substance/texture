import { Component } from 'substance'

export default class CardComponent extends Component {
  didMount () {
    // Note: without a 'managed' approach every card component needs to listen to selection updates
    // TODO: consider to use a reducer that maps the selection to another variable, e.g. activeCard
    // then the cards would not be triggered on every other change
    this.context.appState.addObserver(['selection'], this._onSelectionChange, this, { stage: 'render' })
  }

  dispose () {
    this.context.appState.removeObserver(this)
  }

  render ($$) {
    const modelId = this.props.model.id
    const children = this.props.children
    const label = this.getLabel(this.props.label)
    const el = $$('div')
      .addClass('sc-card')
      .addClass(`sm-${this.props.model.type}`)
      .attr('data-id', modelId)
      .append(
        $$('div').addClass('se-label').append(label)
      )
    el.append(children)
    el.on('click', this._toggleCardSelection)
    return el
  }

  _toggleCardSelection () {
    const model = this.props.model
    const api = this.context.api
    if (model.type === 'figure-panel') {
      const node = model._node
      const figureId = node.getParent().id
      const figureModel = api.getModelById(figureId)
      const panels = figureModel.getPanels()
      const panelIds = panels.getValue()
      const editorSession = this.context.editorSession
      editorSession.updateNodeStates([[figureId, {currentPanelIndex: panelIds.indexOf(model.id)}]])
    }
    api.selectModel(model.id)
  }

  _onSelectionChange (sel) {
    if (sel && sel.customType === 'model') {
      if (sel.data.modelId === this.props.model.id) {
        this.el.addClass('sm-selected')
      } else {
        this.el.removeClass('sm-selected')
      }
    } else {
      this.el.removeClass('sm-selected')
    }
  }
}
