import { domHelpers } from 'substance'
import { Tool } from '../../kit'

export default class UploadTool extends Tool {
  // In addition to the regular button a file input is rendered
  // which is used to trigger the browser's file dialog.
  render ($$) {
    let el = super.render($$)

    const isMultiple = this.canUploadMultiple
    const input = $$('input').attr({
      'type': 'file'
    }).ref('input')
      .on('change', this.onFileSelect)
      .on('click', domHelpers.stop)
    if (!this.doesAcceptAllFileTypes) {
      const fileType = this.getFileType()
      input.attr({'accept': fileType})
    }
    if (isMultiple) {
      input.attr({
        'multiple': 'multiple'
      })
    }
    el.append(input)
    return el
  }

  getClassNames () {
    return 'sc-upload-tool'
  }

  getFileType () {
    throw new Error('This method is abstract')
  }

  get canUploadMultiple () {
    return false
  }

  get doesAcceptAllFileTypes () {
    return false
  }

  _onClick (e) {
    e.stopPropagation()
    e.preventDefault()
    this.refs.input.el.val(null)
    this.refs.input.el.click()
  }

  onFileSelect (e) {
    let files = e.currentTarget.files
    this.executeCommand({
      files: Array.prototype.slice.call(files)
    })
  }
}
