import ToolGroup from './ToolGroup'

/**
 * @param {array} props.items
 * @param {object} props.commandStates
 */
export default class Menu extends ToolGroup {
  _getClassNames () {
    return 'sc-menu'
  }
  _getToolClass (item) {
    // use an ToolClass from toolSpec if configured inline in ToolGroup spec
    let ToolClass
    if (item.ToolClass) {
      ToolClass = item.ToolClass
    } else {
      switch (item.type) {
        case 'group': {
          ToolClass = this.getComponent('menu-group')
          break
        }
        default: {
          ToolClass = super._getToolClass(item)
        }
      }
    }
    return ToolClass
  }
}
