import ToolGroup from './ToolGroup'

/**
  A component that renders a group of menu items.
*/
export default class MenuGroup extends ToolGroup {
  _getToolClass (toolSpec) {
    return toolSpec.ToolClass || this.getComponent('menu-item')
  }

  _getClassNames () {
    return 'sc-menu-group'
  }
}
