import { Component } from 'substance'
import SupplementaryFileUploadComponent from './SupplementaryFileUploadComponent'
import { DialogSectionComponent, InputWithButton } from '../../kit'

export default class AddSupplementaryFileWorkflow extends Component {
  static get desiredWidth () {
    return 'medium'
  }

  didMount () {
    super.didMount()

    this.handleActions({
      'importFile': this._onFileImport
    })
  }

  render ($$) {
    let el = $$('div').addClass('sc-add-supplementary-file sm-workflow')

    let Input = this.getComponent('input')
    let Button = this.getComponent('button')

    const title = $$('div').addClass('se-title').append(
      this.getLabel('supplementary-file-workflow-title')
    )

    const urlInput = $$(InputWithButton, {
      input: $$(Input, {
        placeholder: this.getLabel('supplementary-file-link-placeholder') }
      ).ref('urlInput'),
      button: $$(Button).append(
        this.getLabel('add-action')
      ).on('click', this._onExternalFileImport)
    })

    el.append(
      title,
      $$(DialogSectionComponent, { label: this.getLabel('supplementary-file-upload-label') })
        .append($$(SupplementaryFileUploadComponent)),
      $$(DialogSectionComponent, { label: this.getLabel('supplementary-file-link-label') })
        .append(urlInput)
    )

    return el
  }

  _onExternalFileImport () {
    const url = this.refs.urlInput.val()
    let api = this.context.api
    api.insertSupplementaryFile(null, url)
    this.send('closeModal')
  }

  _onFileImport (files) {
    let api = this.context.api
    api.insertSupplementaryFile(files[0])
    this.send('closeModal')
  }
}
