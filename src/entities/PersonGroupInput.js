import { Component, FontAwesomeIcon } from 'substance'

export default class PersonGroupInput extends Component {

  getInitialState() {
    // We want to keep state in a plain old JS object while editing
    return {
      entries: this.props.entries || []
    }
  }

  render($$) {
    let el = $$('div').addClass('sc-person-group-input')
    let table = $$('table').addClass('se-entries')

    this.state.entries.forEach((entry, index) => {
      table.append(
        $$('tr').append(
          $$('td').append(
            $$('input')
              .attr({name: 'givenNames', type: 'text', value: entry.givenNames, placeholder: 'Given Names' })
              .on('change', this._updateEntry.bind(this, index))
          ),
          $$('td').append(
            $$('input')
              .attr({name: 'surname', type: 'text', value: entry.surname, placeholder: 'Surname' })
              .on('change', this._updateEntry.bind(this, index))
          ),
          $$('td').append(
            $$('button').addClass('se-delete').append(
              $$(FontAwesomeIcon, {icon: 'fa-trash'})
            ).on('click', this._removeEntry.bind(this, index))
          )
        )
      )
    })

    el.append(table)
    el.append(
      $$('button').addClass('se-add-new').append(
        'New'
      ).on('click', this._addNew)
    )
    return el
  }

  _removeEntry(index) {
    let entries = JSON.parse(JSON.stringify(this.state.entries))
    entries.splice(index, 1)
    this.setState({
      entries
    })
  }

  _updateEntry(index) {
    let row = this.el.findAll('tr')[index]
    let givenNames = row.find('input[name=givenNames]').val()
    let surname = row.find('input[name=surname]').val()

    // Make a copy of entries
    let entries = JSON.parse(JSON.stringify(this.state.entries))
    entries[index] = {
      givenNames,
      surname
    }
    this.setState({
      entries
    })
  }

  _addNew() {
    let entries = JSON.parse(JSON.stringify(this.state.entries))
    entries.push({
      givenNames: '',
      surname: ''
    })
    this.setState({
      entries
    })
  }

  getValue() {
    return this.state.entries
  }
}
