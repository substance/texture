import { Component } from 'substance'
import Affiliations from './Affiliations'
import Contributors from './Contributors'


export default class MetadataComponent extends Component {

  render($$) {
    let el = $$('div').addClass('sc-metadata')

    el.append($$(Contributors))
    el.append($$(Affiliations))

    return el
  }
}