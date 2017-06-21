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
    let iconName = this.state.expanded ? 'fa-angle-down' : 'fa-angle-right'
    let label = this.labelProvider.getLabel(this.props.contextId)
    el.append(
      $$('div').addClass('se-toggle').append(
        $$('div').addClass('se-label').append(
          label
        ),
        $$('div').addClass('se-expanded').append(
          $$(Icon, { icon: iconName })
        )
      ).on('click', this._toggle)
    )

    if (this.state.expanded) {
      // el.append(
      //   $$('div').addClass('se-dropdown-content').append('TODO')
      // )
      let menuEl = $$('div').addClass('se-menu')

      panelsSpec.forEach((entry) => {
        if (entry.panel) {
          let label = this.labelProvider.getLabel(entry.panel)
          // let isActive = entry.panel === this.state.contextId

          menuEl.append(
            $$('div').addClas('se-panel').append(
              label
            ).on('click', this._panelSelected.bind(this, entry.panel))
          )

          // scrollPane.append(
          //   $$(MetadataSection, {
          //     label: entry.label,
          //     expanded: isActive
          //   }).on('click', this._switchSection.bind(this, entry.section))
          // )

          // if (isActive) {
          //   const node = doc.find(entry.nodeSelector)
          //   let Component = this.getComponent(entry.section)
          //   scrollPane.append(
          //     $$(Component, { node: node })
          //   )
          // }
        } else if (entry.group) {
          let label = this.labelProvider.getLabel(entry.group)
          menuEl.append(
            $$('div').addClas('se-group').append(
              label
            )
          )
        }
      })

    }
    return el
  }

  _panelSelected(contextId) {
    this.send('')
  }

  _toggle() {
    this.setState({
      expanded: this.state.expanded
    })
  }



}
