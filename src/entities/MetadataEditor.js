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

  didMount() {
    const pubMetaDb = this.context.api.pubMetaDb
    pubMetaDb.on('change', this.rerender, this)
    this.handleActions({
      'collection:add': this._addToCollection,
      'collection:update': this._updateCollection,
      'collection:remove': this._removeFromCollection
    })
  }

  dispose() {
    const pubMetaDb = this.context.api.pubMetaDb
    pubMetaDb.off(this)
  }

  render($$) {
    let el = $$('div').addClass('sc-metadata-editor')
    this.props.sections.forEach(section => {
      el.append(
        $$(CollectionEditor, { collection: section.collection })
      )
    })
    return el
  }

  _addToCollection(col, item) {
    const api = this.context.api
    api.addToCollection(col, item)
  }

  _updateCollection(col, itemId, data) {
    const api = this.context.api
    api.updateCollection(col, itemId, data)
  }

  _removeFromCollection(col, itemId) {
    const api = this.context.api
    api.removeFromCollection(col, itemId)
  }
}









