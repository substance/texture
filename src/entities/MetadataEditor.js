import { Component } from 'substance'
import CollectionEditor from './CollectionEditor'


/*
  Example props:

  { 
    sections: [
      { label: 'Authors', collection: 'authors' },
      { label: 'Editors', collection: 'editors' }
    ]
  }
*/
export default class MetadataEditor extends Component {

  render($$) {
    let el = $$('div').addClass('sc-metadata-editor')
    this.props.sections.forEach(section => {
      el.append(
        $$(CollectionEditor, { collection: section.collection })
      )
    })
    return el
  }
}









