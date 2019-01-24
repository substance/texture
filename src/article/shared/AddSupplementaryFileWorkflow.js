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
      'importFile': this._onFileImport,
      'inputSubmit': this._onExternalFileImport
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
      input: $$(Input, {placeholder: this.getLabel('supplementary-file-link-placeholder')}),
      button: $$(Button).append(this.getLabel('add-action'))
    })

    el.append(
      title,
      $$(DialogSectionComponent, {label: this.getLabel('supplementary-file-upload-label')})
        .append($$(SupplementaryFileUploadComponent)),
      $$(DialogSectionComponent, {label: this.getLabel('supplementary-file-link-label')})
        .append(urlInput)
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
