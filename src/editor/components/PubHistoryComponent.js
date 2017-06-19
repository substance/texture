import { NodeComponent } from 'substance'

/*
  Edit publication history in this MetadataSection
*/
export default class PubHistoryComponent extends NodeComponent {

  render($$) {
    let el = $$('div').addClass('sc-publication-history')
    let history = this.props.node
    let dates = history.findAll('date')
    let received = dates.find(date => { return date.getAttribute('date-type') === 'received' })
    let revReceived = dates.find(date => { return date.getAttribute('date-type') === 'rev-received' })
    let accepted = dates.find(date => { return date.getAttribute('date-type') === 'accepted' })
    el.append(
      this._renderDateEditor($$, received, 'Received'),
      this._renderDateEditor($$, revReceived, 'Review Received'),
      this._renderDateEditor($$, accepted, 'Accepted')
    )
    return el
  }

  _renderDateEditor($$, metaEl, name) {
    let id = metaEl.id
    let value = metaEl.getAttribute('iso-8601-date')
    let el = $$('div').addClass('se-metadata-item').append(
      $$('div').addClass('se-label').append(name),
      $$('input').attr({type: 'date', value: value})
        .addClass('se-text-input')
        .ref(id)
        .on('change', this._updateDateProp.bind(this, metaEl))
    )
    return el
  }

  _updateDateProp(metaEl) {
    let id = metaEl.id
    let value = this.refs[id].val()
    metaEl.setAttribute('iso-8601-date', value)
  }

  _toggle() {
    this.setState({
      expanded: !this.state.expanded
    })
  }

}
