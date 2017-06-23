import { Component } from 'substance'

/*
  Renders a keyboard-selectable ref preview item
*/
export default class FnPreview extends Component {

  render($$) {
    let labelGenerator = this.context.labelGenerator
    let TextNode = this.getComponent('text-node')
    let el = $$('div')
      .addClass('sc-fn-preview')
      .attr({'data-id': this.props.node.id})

    if (this.props.selected) {
      el.addClass('sm-selected')
    }

    el.append(
      $$('div').addClass('se-label').append(
        String(labelGenerator.getPosition('fn', this.props.node.id) || '')
      )
    )

    let node = this.props.node
    let firstP = node.find('p')
    if (firstP) {
      el.append(
        $$(TextNode, {
          node: firstP
        })
      )
    }

    return el
  }
}

