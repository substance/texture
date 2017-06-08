import { Component } from 'substance'

/*
  Renders a keyboard-selectable ref preview item
*/
export default class RefPreview extends Component {

  render($$) {
    let labelGenerator = this.context.labelGenerator
    let el = $$('div')
      .addClass('sc-ref-preview')
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
    let stringCitation = node.find('string-citation')
    let TextNode = this.getComponent('text-node')
    el.append(
      $$(TextNode, {
        node: stringCitation
      })
    )
    return el
  }
}

