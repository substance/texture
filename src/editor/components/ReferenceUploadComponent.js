import { Component } from 'substance'

const supportedFormats = ['CSL-JSON', 'BibTex']

export default class ReferenceUploadComponent extends Component {
  render($$) {
    const labelProvider = this.context.labelProvider
    const el = $$('div').addClass('se-import').append(
      $$('div').addClass('se-section-title').append(
        labelProvider.getLabel('import-refs')
      ),
      $$('div').addClass('se-description').append(
        labelProvider.getLabel('supported-ref-formats') + ': ' + supportedFormats.join(', ')
      )
    )

    const dropZone = $$('div').addClass('se-drop-import').append(
      'Drag and drop or ',
      $$('span').addClass('se-select-trigger')
        .append('select')
        .on('click', this._onClick),
      ' file',
      $$('input').attr('type','file')
        .on('click', this._supressClickPropagation)
        .on('change', this._selectFile)
        .ref('input')
    ).on('drop', this._handleDrop)

    el.append(dropZone)

    return el
  }

  _onClick() {
    this.refs.input.click()
  }

  _supressClickPropagation(e) {
    e.stopPropagation()
  }

  _selectFile() {

  }

  _handleDrop(e) {
    const files = e.dataTransfer.files
    files.forEach(file => {
      const isJSON = file.type.indexOf('application/json') === 0
      if(isJSON) {

      }
    })
  }
}
