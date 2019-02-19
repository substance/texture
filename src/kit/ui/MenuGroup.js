import ToolGroup from './ToolGroup'

/**
  A component that renders a group of menu items.
*/
export default class MenuGroup extends ToolGroup {
  render ($$) {
    console.log('rendering MenuGroup')
    return super.render($$)
  }
  _getClassNames () {
    return 'sc-menu-group'
  }
  _renderLabel ($$) {
    // EXPERIMENTAL: showing a ToolGroup label an
    const { style, label } = this.props
    if (style === 'descriptive' && label) {
      // FIXME: introduce a separator component. Currently this is redundant
      // with code within Menu.js
      let separatorEl = $$('div').addClass('se-separator')
      separatorEl.append(
        $$('div').addClass('se-label').append(
          this.getLabel(label)
        )
      )
      return separatorEl
    }
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
          console.error('Unsupported item type inside ToolGroup:', item.type)
        }
      }
    }
    return ToolClass
  }
}
