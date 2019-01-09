import { DocumentNode, CHILDREN } from 'substance'

export default class Figure extends DocumentNode {
  _initialize (...args) {
    super._initialize(...args)

    this.state = {
      currentPanelIndex: 0
    }
  }

  getCurrentPanelIndex () {
    let currentPanelIndex = 0
    if (this.state) {
      currentPanelIndex = this.state.currentPanelIndex
    }
    return currentPanelIndex
  }

  getPanels () {
    return this.resolve('panels')
  }
}
Figure.schema = {
  type: 'figure',
  panels: CHILDREN('figure-panel')
}
