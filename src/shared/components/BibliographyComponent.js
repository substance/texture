import { Component } from 'substance'
import BibEntryComponent from './BibEntryComponent'

export default class BibliographyComponent extends Component {
  render($$) {
    let bibliography = this.props.bibliography
    let el = $$('div').addClass('sc-bibliography')
    el.append(
      $$('div').addClass('se-title').append('References')
    )
    bibliography.forEach(entry => {
      el.append(
        $$(BibEntryComponent, entry)
      )
    })
    return el
  }
}