import { DefaultDOMElement } from 'substance'
import { NodeComponent } from '../../kit'
import renderModelComponent from './renderModelComponent'
import { PREVIEW_MODE } from '../../article/ArticleConstants'

export default class FigureComponent extends NodeComponent {
  /*
    Note: in the Manuscript View only one figure panel is shown at time.
  */
  render ($$) {
    let mode = this._getMode()
    let model = this.props.model

    let el = $$('div').addClass('sc-figure').addClass(`sm-${mode}`)

    if (model.hasPanels()) {
      let content
      switch (mode) {
        case 'metadata':
          content = this._renderAllPanels($$)
          break
        default:
          content = this._renderCarousel($$)
      }
      el.append(content)
    }

    return el
  }

  _renderCarousel ($$) {
    let model = this.props.model
    const panelsLength = model.getPanelsLength()
    if (panelsLength === 1) {
      return this._renderCurrentPanel($$)
    }
    return $$('div').addClass('se-carousel').append(
      $$('div').addClass('se-current-panel').append(
        this._renderCurrentPanel($$)
      ),
      $$('div').addClass('se-thumbnails').append(
        this._renderThumbnails($$)
      )
    )
  }

  _renderCurrentPanel ($$) {
    let panel = this._getCurrentPanel()
    return renderModelComponent(this.context, $$, {
      model: panel,
      mode: this.props.mode
    })
  }

  _renderThumbnails ($$) {
    const model = this.props.model
    const panels = model.getPanels()
    const currentIndex = this._getCurrentPanelIndex()
    return panels.getItems().map((panel, idx) => {
      const thumbnail = renderModelComponent(this.context, $$, {
        model: panel,
        mode: PREVIEW_MODE
      })
      if (currentIndex === idx) {
        thumbnail.addClass('sm-current-panel')
      } else {
        thumbnail.on('click', this._handleThumbnailClick)
      }
      return thumbnail
    })
  }

  _renderAllPanels ($$) {
    let model = this.props.model
    let panels = model.getPanels()
    let els = panels.getItems().map(panel => renderModelComponent(this.context, $$, {
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
    let panels = model.getPanels()
    return panels.getItemAt(currentPanelIndex)
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

  _handleThumbnailClick (e) {
    const model = this.props.model
    const panels = model.getPanels()
    const panelIds = panels.getValue()
    // ATTENTION: wrap the native element here so that this works for testing too
    let target = DefaultDOMElement.wrap(e.currentTarget)
    const panelId = target.getAttribute('data-id')
    if (panelId) {
      const editorSession = this.context.editorSession
      editorSession.updateNodeStates([[model.id, {currentPanelIndex: panelIds.indexOf(panelId)}]])
    }
  }
}
