import { Component, FontAwesomeIcon as Icon } from 'substance'

export default class Navigator extends Component {

  getInitialState() {
    return {
      expanded: false
    }
  }

  render($$) {
    let el = $$('div').addClass('sc-navigator')
    const panelsSpec = this.props.panelsSpec
    let label = this.context.labelProvider.getLabel(this.props.contextId)
    el.append(
      $$('div').addClass('se-toggle').append(
        $$('div').addClass('se-label').append(
          label
        ),
        $$('div').addClass('se-expanded').append(
          $$(Icon, { icon: 'fa-angle-down' })
        )
      ).on('click', this._toggle)
    )

    if (this.state.expanded) {
      let menuEl = $$('div').addClass('se-menu')
      panelsSpec.forEach((entry) => {
        if (entry.panel) {
          let label = this.context.labelProvider.getLabel(entry.panel)
          let isActive = entry.panel === this.props.contextId
          let menuItem = $$('button').addClass('se-menu-item').append(
            label
          ).on('click', this._panelSelected.bind(this, entry.panel))
          if (isActive) {
            menuItem.addClass('sm-active')
          }
          menuEl.append(
            menuItem
          )
        } else if (entry.group) {
          let label = this.context.labelProvider.getLabel(entry.group)
          menuEl.append(
            $$('div').addClass('se-menu-group').append(
              label
            )
          )
        }
      })
      el.append(menuEl)
    }
    return el
  }

  _panelSelected(contextId) {
    this.send('navigate', contextId)
    // Close popup
    this.setState({
      expanded: false
    })
  }

  _toggle() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

}
