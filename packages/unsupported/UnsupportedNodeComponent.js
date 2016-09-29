import { Component } from 'substance'

class UnsupportedNodeComponent extends Component {

  render($$) {
    let el = $$('span')
      .addClass('sc-unsupported-inline-node')
      .attr('data-id', this.props.node.id)
      .attr('contenteditable', false)
      .append(
        $$('button').addClass('se-toggle').append(
          $$('pre').append(
            $$('code').append(
              '<'+this.props.node.tagName+'>'
            )
          )
        )
      )
    return el
  }
}

UnsupportedNodeComponent.fullWidth = true
UnsupportedNodeComponent.noStyle = true

export default UnsupportedNodeComponent
