import { Component } from 'substance'
import DOIInputComponent from './DOIInputComponent'
import ReferenceUploadComponent from './ReferenceUploadComponent'
import { INTERNAL_BIBR_TYPES } from '../ArticleConstants'

export default class AddReferenceWorkflow extends Component {
  didMount () {
    super.didMount()

    this.handleActions({
      'importBib': this._onImport
    })
  }

  render ($$) {
    let el = $$('div').addClass('sc-add-reference sm-workflow')

    const title = $$('div').addClass('se-title').append(
      this.getLabel('add-reference-title')
    )

    const manualAddEl = $$('div').addClass('se-manual-add').append(
      $$('div').addClass('se-section-title').append(
        this.getLabel('add-ref-manually')
      )
    )

    const refTypesButtons = $$('ul').addClass('se-reftypes-list')
    INTERNAL_BIBR_TYPES.forEach(item => {
      refTypesButtons.append(
        $$('li').addClass('se-type sm-' + item).append(
          this.getLabel(item)
        ).on('click', this._onAdd.bind(this, item))
      )
    })
    manualAddEl.append(refTypesButtons)

    el.append(
      title,
      $$(DOIInputComponent),
      $$(ReferenceUploadComponent, {title: 'import-refs'}),
      manualAddEl
    )

    return el
  }

  _onAdd (type) {
    this.context.api._addReference({type})
    this.send('closeModal')
  }

  _onImport (items) {
    this.context.api._addReferences(items)
    this.send('closeModal')
  }
}
