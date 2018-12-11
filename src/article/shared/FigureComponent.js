import { NodeComponent } from '../../kit'
import renderModelComponent from './renderModelComponent'

export default class FigureComponent extends NodeComponent {
  /*
    Note: in the Manuscript View only one figure panel is shown at time.
  */
  render ($$) {
    let mode = this._getMode()
    let model = this.props.model

    let el = $$('div').addClass('sc-figure').addClass(`sm-${mode}`).addClass('foo')

    if (model.hasPanels()) {
      let content
      switch (mode) {
        case 'metadata':
          content = this._renderAllPanels($$)
          break
        default:
          content = this._renderCurrentPanel($$)
      }
      el.append(content)
    }

    return el
  }

  _renderCurrentPanel ($$) {
    let panel = this._getCurrentPanel()
    return renderModelComponent(this.context, $$, {
      model: panel,
      mode: this.props.mode
    })
  }

  _renderAllPanels ($$) {
    let model = this.props.model
    let panels = model.getPanels()
    let els = panels.map(panel => renderModelComponent(this.context, $$, {
      model: panel,
      mode: this.props.mode
    }))
    if (panels.length > 1) {
      let currentPanelIndex = this._getCurrentPanelIndex()
      els[currentPanelIndex].addClass('sm-current-panel')
    }
    return els
  }

  _getMode () {
    return this.props.mode || 'manuscript'
  }

  _getCurrentPanel () {
    let model = this.props.model
    let currentPanelIndex = this._getCurrentPanelIndex()
    let panel = model.getPanels()[currentPanelIndex]
    return panel
  }

  _getCurrentPanelIndex () {
    let model = this.props.model
    let node = model._node
    let currentPanelIndex = 0
    if (node.state) {
      currentPanelIndex = node.state.currentPanelIndex
    }
    // FIXME: node state is corrupt
    if (!node.panels[currentPanelIndex]) {
      console.error('figurePanel.state.currentPanelIndex is corrupt')
      node.state.currentPanelIndex = currentPanelIndex = 0
    }
    return currentPanelIndex
  }
}
