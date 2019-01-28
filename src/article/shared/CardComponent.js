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
    const node = this.props.node
    const nodeId = node.id
    const children = this.props.children
    const label = this.getLabel(this.props.label)
    const el = $$('div')
      .addClass(this._getClassNames())
      .attr('data-id', nodeId)
      .append(
        $$('div').addClass('se-label').append(label)
      )
    el.append(children)
    el.on('click', this._toggleCardSelection)
    return el
  }

  _getClassNames () {
    return `sc-card sm-${this.props.node.type}`
  }

  _toggleCardSelection () {
    const node = this.props.node
    const api = this.context.api
    if (node.type === 'figure-panel') {
      const figure = node.getParent()
      const panelIds = figure.panels
      const editorSession = this.context.editorSession
      editorSession.updateNodeStates([[figure.id, {currentPanelIndex: panelIds.indexOf(node.id)}]], { propagate: true })
    }
    api.selectModel(node.id)
  }

  _onSelectionChange (sel) {
    if (sel && sel.customType === 'model') {
      if (sel.data.modelId === this.props.node.id) {
        this.el.addClass('sm-selected')
      } else {
        this.el.removeClass('sm-selected')
      }
    } else {
      this.el.removeClass('sm-selected')
    }
  }
}
