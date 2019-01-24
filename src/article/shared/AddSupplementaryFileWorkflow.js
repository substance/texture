import { Component } from 'substance'
import SupplementaryFileUploadComponent from './SupplementaryFileUploadComponent'

export default class AddSupplementaryFileWorkflow extends Component {
  static get desiredWidth () {
    return 'medium'
  }

  didMount () {
    super.didMount()

    this.handleActions({
      'importFile': this._onFileImport,
      'inputSubmit': this._onExternalFileImport
    })
  }

  render ($$) {
    let el = $$('div').addClass('sc-add-supplementary-file sm-workflow')

    const title = $$('div').addClass('se-title').append(
      this.getLabel('supplementary-file-workflow-title')
    )

    // const urlInput = $$(InputActionComponent, {
    //   placeholder: 'enter-url-placeholder',
    //   actionLabel: 'add-action'
    // })

    // TODO: add url input
    el.append(
      title,
      $$(SupplementaryFileUploadComponent, {title: 'supplementary-file-upload-placeholder'})
      //urlInput
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
