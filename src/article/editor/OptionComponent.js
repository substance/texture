import { Component } from 'substance'

export default class OptionComponent extends Component {
  render ($$) {
    let id = this.props.id
    let el = $$('div')
      .addClass('sc-option')
      .attr({'data-id': id})

    if (this.props.selected) {
      el.addClass('sm-selected')
    }

    if (this.props.thumbnail) {
      el.append(
        $$('div').addClass('se-thumbnail').append(
          this.props.thumbnail
        )
      )
    }

    el.append(
      $$('div').addClass('se-label').append(
        this.props.label
      ),
      // NOTE: description is passed in as HTML string
      $$('div').addClass('se-description').html(
        this.props.description
      )
    )
    return el
  }
}
