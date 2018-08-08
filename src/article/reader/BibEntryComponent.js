import { Component } from 'substance'

export default class BibEntryComponent extends Component {
  render($$) {
    let el = $$('div').addClass('sc-bib-entry')
    el.append(
      $$('div').addClass('se-label').append(this.props.label),
      $$('div').addClass('se-html').html(this.props.html)
    ).attr('id',this.props.id)
    return el
  }
}
