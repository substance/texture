import { Component } from 'substance'

export default class FileUploadComponent extends Component {
  get title () {
    return this.getLabel(this.props.title)
  }

  get description () {
    return false
  }

  get acceptedFiles () {
    return false
  }

  render ($$) {
    const el = $$('div').addClass('sc-file-upload')

    const selectInput = $$('input').attr({
      type: 'file'
    }).on('click', this._supressClickPropagation)
      .on('change', this._selectFile)
      .ref('input')

    if (this.acceptedFiles) {
      selectInput.attr({accept: this.acceptedFiles})
    }

    // HACK: to place a link inside label we will use
    // another placeholder with a substring of first one
    const placeholder = this.getLabel('file-upload-placeholder')
    const selectPlaceholder = this.getLabel('file-upload-select-placeholder')
    const placeholderParts = placeholder.split(selectPlaceholder)

    const dropZone = $$('div').addClass('se-drop-import').append(
      placeholderParts[0],
      $$('span').addClass('se-select-trigger')
        .append(selectPlaceholder)
        .on('click', this._onClick),
      placeholderParts[1],
      selectInput
    ).on('drop', this._handleDrop)
      .on('dragstart', this._onDrag)
      .on('dragenter', this._onDrag)
      .on('dragend', this._onDrag)

    el.append(dropZone)

    if (this.state.error) {
      el.append(
        $$('div').addClass('se-error-popup').append(this.renderErrorsList($$))
      )
    }

    return el
  }

  renderErrorsList ($$) {
    return $$('ul').addClass('se-error-list').append(this.getLabel('file-upload-error'))
  }

  _onClick () {
    this.refs.input.click()
  }

  _supressClickPropagation (e) {
    e.stopPropagation()
  }

  _selectFile (e) {
    const files = e.currentTarget.files
    this._handleUploadedFiles(files)
  }

  _handleDrop (e) {
    const files = e.dataTransfer.files
    this._handleUploadedFiles(files)
  }

  _handleUploadedFiles (files) {
    Object.values(files).forEach(file => {
      const reader = new window.FileReader()
      reader.onload = this._onFileLoad.bind(this)
      reader.readAsText(file)
    })
  }

  _onFileLoad (e) {
    throw new Error('This method is abstract')
  }

  _onDrag (e) {
    // Stop event propagation for the dragstart and dragenter
    // events, to avoid editor drag manager errors
    e.stopPropagation()
  }
}
