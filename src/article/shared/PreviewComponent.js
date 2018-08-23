import { Component } from 'substance'

export default class PreviewComponent extends Component {
  getChildContext () {
    return {
      editable: false
    }
  }

  render ($$) {
    let id = this.props.id
    let el = $$('div')
      .addClass('sc-preview')
      .attr({'data-id': id})

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
      $$('div').addClass('se-description').append(
        this.props.description
      )
    )
    return el
  }
}
