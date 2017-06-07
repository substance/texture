import { Component } from 'substance'

/*
  Renders a keyboard-selectable ref target item
*/
class RefTarget extends Component {

  render($$) {
    let labelGenerator = this.context.labelGenerator
    let el = $$('div')
      .addClass('sc-ref-target')
      .attr({'data-id': this.props.node.id})

    if (this.props.selected) {
      el.addClass('sm-selected')
    }

    el.append(
      $$('div').addClass('se-label').append(
        String(labelGenerator.getPosition('bibr', this.props.node.id) || '')
      )
    )

    let node = this.props.node
    let TextProperty = this.getComponent('text')
    el.append(
      $$(TextProperty, {
        path: node.getTextPath()
      })
    )
    return el
  }
}

export default RefTarget
