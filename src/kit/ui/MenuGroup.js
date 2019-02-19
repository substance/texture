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
}
