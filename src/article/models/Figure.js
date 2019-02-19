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

  // NOTE: we are using structure of first panel as template for new one,
  // currently we are replicating the structure of metadata fields
  getPanelTemplate () {
    const firstPanel = this.getPanels()[0]
    return {
      metadata: firstPanel.resolve('metadata').map(metadataField => (
        { type: 'custom-metadata-field', name: metadataField.name, value: '' }
      ))
    }
  }
}
Figure.schema = {
  type: 'figure',
  panels: CHILDREN('figure-panel')
}
