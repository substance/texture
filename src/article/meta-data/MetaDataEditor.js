import { Component } from 'substance'

export default class MetaDataEditor extends Component {
  render ($$) {
    let el = $$('div').addClass('sc-meta-data-editor')
    el.append('Meta-Data Editor coming...')
    return el
  }
}
