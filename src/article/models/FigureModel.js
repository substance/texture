import { NodeModel, CollectionValueModel } from '../../kit'

export default class FigureModel extends NodeModel {
  hasPanels () {
    const length = this.getPanelsLength()
    return length > 0
  }

  getPanelsLength () {
    return this._node.panels.length
  }

  getPanels () {
    return new CollectionValueModel(this._api, [this._node.id, 'panels'], 'figure-panel')
  }

  getCurrentPanelIndex () {
    const node = this._node
    let currentPanelIndex = 0
    if (node.state) {
      currentPanelIndex = node.state.currentPanelIndex
    }
    return currentPanelIndex
  }

  addPanel (file) {
    const api = this._api
    const panels = this.getPanels()
    const index = this.getCurrentPanelIndex()
    api._insertFigurePanel(file, panels, index)
  }

  removePanel () {
    const api = this._api
    const panels = this.getPanels()
    const index = this.getCurrentPanelIndex()
    const panel = panels.getItemAt(index)
    api._removeFigurePanel(panel, panels)
  }

  movePanelDown () {
    const pos = this.getCurrentPanelIndex()
    if (pos < this.getPanelsLength()) {
      this.movePanel(pos, pos + 1)
    }
  }

  movePanelUp () {
    const pos = this.getCurrentPanelIndex()
    if (pos > 0) {
      this.movePanel(pos, pos - 1)
    }
  }

  movePanel (from, to) {
    return this._api._moveFigurePanel(this, from, to)
  }
}
