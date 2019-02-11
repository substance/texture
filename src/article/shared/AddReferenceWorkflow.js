import { Component } from 'substance'
import DOIInputComponent from './DOIInputComponent'
import ReferenceUploadComponent from './ReferenceUploadComponent'
import { INTERNAL_BIBR_TYPES } from '../ArticleConstants'
import { DialogSectionComponent } from '../../kit'

export default class AddReferenceWorkflow extends Component {
  static get desiredWidth () {
    return 'large'
  }

  get supportedUploadFormats () {
    return ['CSL-JSON']
  }

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

    const refTypesButtons = $$('ul').addClass('se-reftypes-list')
    INTERNAL_BIBR_TYPES.forEach(item => {
      refTypesButtons.append(
        $$('li').addClass('se-type sm-' + item).append(
          this.getLabel(item)
        ).on('click', this._onAdd.bind(this, item))
      )
    })
    const manualAddEl = $$('div').addClass('se-manual-add').append(refTypesButtons)

    el.append(
      title,
      $$(DialogSectionComponent, { label: this.getLabel('fetch-datacite') })
        .append($$(DOIInputComponent)),
      $$(DialogSectionComponent, {
        label: this.getLabel('import-refs'),
        description: this.getLabel('supported-ref-formats') + ': ' + this.supportedUploadFormats.join(', ')
      }).append($$(ReferenceUploadComponent)),
      $$(DialogSectionComponent, { label: this.getLabel('add-ref-manually') })
        .append(manualAddEl)
    )

    return el
  }

  _onAdd (type) {
    this.context.api._addReference({ type })
    this.send('closeModal')
  }

  _onImport (items) {
    this.context.api._addReferences(items)
    this.send('closeModal')
  }
}
