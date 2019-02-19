import Menu from './ToolGroup'

/**
  A component that renders a group of menu items.
*/
export default class MenuGroup extends Menu {
  _getClassNames () {
    return 'sc-menu-group'
  }
  _renderLabel ($$) {
    // EXPERIMENTAL: showing a ToolGroup label an
    const { style, label } = this.props
    if (style === 'descriptive' && label) {
      const SeparatorClass = this.getComponent('tool-separator')
      return $$(SeparatorClass, { label })
    }
  }
}
