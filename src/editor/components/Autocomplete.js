import { Component, FontAwesomeIcon, Input } from 'substance'

// data: {id: ‘entity-25’, html: ‘blablup’}
// result: entityId

export default class Autocomplete extends Component {
  getInitialState() {
    return {
      data: this.props.data
    }
  }

  render($$) {
    const data = this.state.data

    let dataList = $$('ul').addClass('se-data-list')
    data.forEach(item => {
      let itemEl = $$('li').addClass('se-data-item').html(item.html).ref(item.id)

      if(item.id === this.state.value || item.id === this.state.focus) {
        itemEl.addClass('sm-active')
      } else {
        itemEl.on('click', this._setValue.bind(this, item.id))
      }

      dataList.append(itemEl)
    })

    let input = $$('Input', {placeholder: this.props.placeholder, value: this.state.value})
      .addClass('se-input')
      .ref('input')

    let icon = this.state.dropdown ? 'fa-caret-down' : 'fa-caret-up'

    let el = $$('div').addClass('sc-autocomplete').append(
      input
        .on('keyup', this._onKeyUp)
        .on('keydown', this._onKeyDown),
      $$(FontAwesomeIcon, {icon: icon}).addClass('se-toggle')
        .on('click', this._toggleList.bind(this))
    )

    if(this.state.dropdown) el.append(dataList)

    return el
  }

  getValue() {
    return this.state.value
  }

  _toggleList() {
    const current = this.state.dropdown
    this.extendState({dropdown: !current})
  }

  _setValue(value) {
    this.extendState({value: value, dropdown: false, focus: undefined})
    this.refs['input'].val(value)
  }

  _onKeyUp(e) {
    if (e.which !== 13 && e.keyCode !== 13) {
      if(this.state.mode !== 'server') {
        const value = this.refs['input'].val()
        const data = this.props.data
        const filtered = data.filter(item => {
          return item.id.toLowerCase().startsWith(value.toLowerCase())
        })
        this.extendState({data: filtered, dropdown: filtered.length > 0})
      } else {
        const value = this.refs['input'].val()
        this.send('filter', value)
      }
    }
  }

  _onKeyDown(e) {
    if (e.which === 13 || e.keyCode === 13) {
      e.preventDefault()
      if(this.state.focus) this._setValue(this.state.focus)
    } else if (e.which === 38 || e.keyCode === 38) {
      e.preventDefault()
      const currentFocus = this.state.focus
      const items = this.state.data
      if (currentFocus !== undefined && items.length > 0) {
        const index = items.findIndex(item => { return item.id === currentFocus })
        if(index > 0) {
          const prevFocus = items[index - 1].id
          this.extendState({focus: prevFocus, dropdown: true})
        } else {
          this.extendState({focus: items[items.length - 1].id, dropdown: true})
        }
      }
    } else if (e.which === 40 || e.keyCode === 40) {
      e.preventDefault()
      const currentFocus = this.state.focus
      const items = this.state.data
      if(currentFocus === undefined && items.length > 0) {
        const nextFocus = items[0].id
        this.extendState({focus: nextFocus, dropdown: true})
      } else {
        const index = items.findIndex(item => { return item.id === currentFocus })
        if(items[index + 1] !== undefined) {
          const nextFocus = items[index + 1].id
          this.extendState({focus: nextFocus, dropdown: true})
        } else {
          const nextFocus = items[0].id
          this.extendState({focus: nextFocus, dropdown: true})
        }
      }
    }
  }
}
