import { Component } from 'substance'
import SupplementaryFileUploadComponent from './SupplementaryFileUploadComponent'

export default class AddSupplementaryFileWorkflow extends Component {
  didMount () {
    super.didMount()

    this.handleActions({
      'importFile': this._onFileImport,
      'importExternalFile': this._onExternalFileImport
    })
  }

  render ($$) {
    let el = $$('div').addClass('se-add-supple')

    const title = $$('div').addClass('se-title').append(
      this.getLabel('supplementary-file-workflow-title')
    )

    // TODO: add url input
    el.append(
      title,
      $$(SupplementaryFileUploadComponent, {title: 'supplementary-file-upload-placeholder'})
    )

    return el
  }

  _onExternalFileImport (url) {
    // TODO: Handle file links
    this.send('closeModal')
  }

  _onFileImport (file) {
    let api = this.context.api
    api._insertSupplementaryFile(file)
    this.send('closeModal')
  }
}
