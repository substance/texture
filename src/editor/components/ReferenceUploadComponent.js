import { Component } from 'substance'
import { convertCSLJSON } from '../../converter/bib/BibConversion'

const supportedFormats = ['CSL-JSON']

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
    .on('dragstart', this._onDrag)
    .on('dragenter', this._onDrag)

    el.append(dropZone)

    return el
  }

  _onClick() {
    this.refs.input.click()
  }

  _supressClickPropagation(e) {
    e.stopPropagation()
  }

  _selectFile(e) {
    const files = e.currentTarget.files
    this._handleUploadedFiles(files)
  }

  _handleDrop(e) {
    const files = e.dataTransfer.files
    this._handleUploadedFiles(files)
  }

  _handleUploadedFiles(files) {
    Object.values(files).forEach(file => {
      const isJSON = file.type.indexOf('application/json') === 0
      if(isJSON) {
        const reader = new FileReader()
        reader.onload = this._onFileLoad.bind(this)
        reader.readAsText(file)
      }
    })
  }

  _onFileLoad(e) {
    const res = e.target.result
    if(res) {
      let conversionErrors = []
      let convertedEntries = []
      const entries = JSON.parse(res)
      entries.forEach(entry => {
        try {
          convertedEntries.push(
            convertCSLJSON(entry)
          )
        } catch(error) {
          conversionErrors.push(entry.DOI)
        }
      })

      this.send('importBib', convertedEntries)
    }
  }

  _onDrag(e) {
    // Stop event propagation for the dragstart and dragenter
    // events, to avoid editor drag manager errors
    e.stopPropagation()
  }
}
