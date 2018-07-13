import { Component } from 'substance'

export default class AbstractComponent extends Component {

  /*
    Hide abstract by default if empty

    TODO: we should make this configurable
  */
  getInitialState() {
    const node = this.props.node
    let isEmpty = node.children.length === 1 && node.children[0].textContent === ''
    return {
      hidden: isEmpty
    }
  }

  render($$) {
    const node = this.props.node
    let el = $$('div')
      .addClass('sc-abstract')
      .attr('data-id', node.id)

    if (!this.state.hidden) {
      el.append(
        $$('h1').addClass('sc-heading').append('Abstract')
      )
      el.append(
        $$(this.getComponent('container'), {
          placeholder: 'Enter Abstract',
          name: 'abstractEditor',
          node: node,
          disabled: this.props.disabled
        })
      )
    } else {
      el.addClass('sm-hidden')
    }
    return el
  }

}
