import { Component } from 'substance'

/**
  @param {object} props.toolPanel a ToolPanel specifcation
  @param {string} props.theme
*/
export default class ToolPanel extends Component {
  render($$) { // eslint-disable-line
    throw new Error('This method is abstract')
  }
  /*
    Defines the components used to render certain entry types

    Override to customize.
  */
  getEntryTypeComponents () {
    return {
      'group': this.getComponent('tool-group'),
      'dropdown': this.getComponent('tool-dropdown'),
      'prompt': this.getComponent('tool-prompt'),
      'separator': this.getComponent('tool-separator'),
      'switcher': this.getComponent('tool-switcher')
    }
  }

  _renderEntries ($$) {
    const toolPanelSpec = this.props.toolPanel
    const commandStates = this.props.commandStates
    const theme = this.getTheme()
    const entryTypeComponents = this.getEntryTypeComponents()
    return toolPanelSpec.map(entry => {
      let ComponentClass = entryTypeComponents[entry.type]
      if (!ComponentClass) throw new Error('Toolpanel entry type not found')
      let props = Object.assign({}, entry, {
        commandStates,
        theme
      })
      let el = $$(ComponentClass, props)
      // only add a reference if there is a name
      if (entry.name) el.ref(entry.name)
      return el
    })
  }

  hasEnabledTools (commandStates) {
    let entriesContainer = this.refs.entriesContainer
    let entries = entriesContainer.childNodes
    let hasEnabledTools = false
    entries.forEach((entry) => {
      if (entry.hasEnabledTools(commandStates)) {
        hasEnabledTools = true
      }
    })
    return hasEnabledTools
  }

  getActiveToolGroupNames () {
    throw new Error('Abstract method')
  }

  showDisabled () {
    return false
  }

  /*
    Override if you just want to use a different style
  */
  getToolStyle () {
    throw new Error('Abstract method')
  }

  getTheme () {
    return this.props.theme || 'dark'
  }
}
