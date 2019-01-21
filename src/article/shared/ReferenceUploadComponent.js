import { convertCSLJSON } from '../converter/bib/BibConversion'
import FileUploadComponent from './FileUploadComponent'

const supportedFormats = ['CSL-JSON']

export default class ReferenceUploadComponent extends FileUploadComponent {
  get description () {
    return this.getLabel('supported-ref-formats') + ': ' + supportedFormats.join(', ')
  }

  get acceptedFiles () {
    return 'application/json'
  }

  renderErrorsList ($$) {
    const dois = this.state.error.dois
    const errorsList = $$('ul').addClass('se-error-list')
    errorsList.append(
      $$('li').append(this.state.error.message)
    )
    if (dois) {
      errorsList.append(dois.map(d => $$('li').append('- ' + d)))
    }
    return errorsList
  }

  _onFileLoad (e) {
    const res = e.target.result
    if (res) {
      let conversionErrors = []
      let convertedEntries = []
      const entries = JSON.parse(res)
      entries.forEach(entry => {
        try {
          convertedEntries.push(
            convertCSLJSON(entry)
          )
        } catch (error) {
          conversionErrors.push(entry.DOI || error)
        }
      })

      if (conversionErrors.length > 0) {
        let error = new Error('Conversion error')
        error.dois = conversionErrors
        this.extendState({error})
      } else {
        this.send('importBib', convertedEntries)
      }
    }
  }
}
