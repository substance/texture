import { Component, FontAwesomeIcon } from 'substance'
import FormRowComponent from '../shared/FormRowComponent'
import TextInput from './TextInput'

export default class RefContribEditor extends Component {
  constructor (...args) {
    super(...args)
    this.handleActions({
      'set-value': this._updateContrib
    })
  }

  render ($$) {
    const items = this.props.values

    let el = $$('div').addClass('sc-ref-contrib-editor')

    items.forEach(item => {
      el.append(
        this._renderEditor($$, item)
      )
    })

    el.append(
      $$('button').addClass('se-add-value')
        .append(
          $$(FontAwesomeIcon, {icon: 'fa-plus'}).addClass('se-icon'),
          'Add contributor'
        )
        .on('click', this._addContrib)
    )

    if (this.props.warning) el.addClass('sm-warning')

    return el
  }

  _renderEditor ($$, item) {
    return $$(FormRowComponent).append(
      $$(TextInput, {id: item.id, name: 'givenNames', value: item.givenNames, placeholder: 'Given names'}),
      $$(TextInput, {id: item.id, name: 'name', value: item.name, placeholder: 'Last name'}),
      $$('button').addClass('se-remove-value')
        .append($$(FontAwesomeIcon, {icon: 'fa-trash'}))
        .on('click', this._removeContrib.bind(this, item.id))
    ).ref(item.id)
  }

  _addContrib () {
    this.send('add-contrib', this.props.name)
  }

  _removeContrib (itemId) {
    this.send('remove-contrib', this.props.name, itemId)
  }

  _updateContrib (propName, value, itemId) {
    this.send('update-contrib', itemId, propName, value)
  }

  _getContrib (id) {
    const article = this.context.api.getArticle()
    return article.get(id)
  }

  _getValue () {
    const items = this.state.items
    return items.map(item => item.id)
  }
}
