import { NodeComponent } from '../../kit'

export default class FigureComponent extends NodeComponent {
  /*
    Note: in the Manuscript View only one figure panel is shown at time.
  */
  render ($$) {
    let mode = this._getMode()
    let node = this.props.node
    let panels = node.panels

    let el = $$('div').addClass('sc-figure').addClass(`sm-${mode}`).attr('data-id', node.id)
    if (panels.length > 0) {
      let content = this._renderCarousel($$, panels)
      el.append(content)
    }
    return el
  }

  _renderCarousel ($$, panels) {
    if (panels.length === 1) {
      return this._renderCurrentPanel($$)
    } else {
      return $$('div').addClass('se-carousel').append(
        this._renderNavigation($$),
        $$('div').addClass('se-current-panel').append(
          this._renderCurrentPanel($$)
        )
      )
    }
  }

  _renderCurrentPanel ($$) {
    let panel = this._getCurrentPanel()
    let PanelComponent = this.getComponent(panel.type)
    return $$(PanelComponent, {
      node: panel,
      mode: this.props.mode
    }).ref(panel.id)
  }

  _renderNavigation ($$) {
    const node = this.props.node
    const panels = node.getPanels()
    const numberOfPanels = panels.length
    const currentIndex = this._getCurrentPanelIndex() + 1
    const currentPosition = currentIndex + ' / ' + numberOfPanels
    const leftControl = $$('div').addClass('se-control sm-previous').append(
      this._renderIcon($$, 'left-control')
    )
    if (currentIndex > 1) {
      leftControl.on('click', this._onSwitchPanel.bind(this, 'left'))
    } else {
      leftControl.addClass('sm-disabled')
    }
    const rightControl = $$('div').addClass('se-control sm-next').append(this._renderIcon($$, 'right-control'))
    if (currentIndex < numberOfPanels) {
      rightControl.on('click', this._onSwitchPanel.bind(this, 'right'))
    } else {
      rightControl.addClass('sm-disabled')
    }
    return $$('div').addClass('se-navigation').append(
      $$('div').addClass('se-current-position').append(currentPosition),
      $$('div').addClass('se-controls').append(
        leftControl,
        rightControl
      )
    )
  }

  _getMode () {
    return this.props.mode || 'manuscript'
  }

  _getCurrentPanel () {
    let node = this.props.node
    let doc = node.getDocument()
    let currentPanelIndex = this._getCurrentPanelIndex()
    let ids = node.panels
    return doc.get(ids[currentPanelIndex])
  }

  _getCurrentPanelIndex () {
    let node = this.props.node
    let state = node.state
    let panels = node.panels
    let currentPanelIndex = 0
    if (state) {
      currentPanelIndex = state.currentPanelIndex
    }
    // FIXME: state is corrupt
    if (currentPanelIndex < 0 || currentPanelIndex >= panels.length) {
      console.error('figurePanel.state.currentPanelIndex is corrupt')
      state.currentPanelIndex = currentPanelIndex = 0
    }
    return currentPanelIndex
  }

  _onSwitchPanel (direction) {
    let currentIndex = this._getCurrentPanelIndex()
    this.context.api._switchFigurePanel(this.props.node, direction === 'left' ? --currentIndex : ++currentIndex)
  }

  _renderIcon ($$, iconName) {
    return $$('div').addClass('se-icon').append(
      this.context.iconProvider.renderIcon($$, iconName)
    )
  }
}
