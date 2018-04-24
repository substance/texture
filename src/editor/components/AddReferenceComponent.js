import { Component } from 'substance'
import DOIInputComponent from './DOIInputComponent'
import ReferenceUploadComponent from './ReferenceUploadComponent'

const targetTypes = [
  'journal-article', 'book', 'chapter', 'conference-proceeding',
  'clinical-trial', 'preprint', 'report',
  'periodical', 'data-publication', 'patent',
  'webpage', 'thesis', 'software'
]

export default class AddReferenceComponent extends Component {
  render($$) {
    const labelProvider = this.context.labelProvider

    let el = $$('div').addClass('se-add-reference')

    const title = $$('div').addClass('se-title').append(
      labelProvider.getLabel('add-reference-title')
    )

    const manualAddEl = $$('div').addClass('se-manual-add').append(
      $$('div').addClass('se-section-title').append(
        labelProvider.getLabel('add-ref-manually')
      )
    )

    const refTypesButtons = $$('ul').addClass('se-reftypes-list')
    targetTypes.forEach(item => {
      refTypesButtons.append(
        $$('li').addClass('se-type').append(
          labelProvider.getLabel(item)
        ).on('click', this._onAdd.bind(this, item))
      )
    })
    manualAddEl.append(refTypesButtons)

    el.append(
      title,
      $$(DOIInputComponent),
      $$(ReferenceUploadComponent),
      manualAddEl
    )

    return el
  }

  _onAdd(item) {
    this.send('add', item)
  }
}
