import { ToggleTool } from '../../kit'

export default class InsertFigureTool extends ToggleTool {
  renderButton ($$) {
    let button = super.renderButton($$)
    let input = $$('input').attr({
      'type': 'file',
      'multiple': 'multiple',
      'accept': 'image/*'
    }).ref('input')
      .on('change', this.onFileSelect)
    return [button, input]
  }

  getClassNames () {
    return 'sc-insert-figure-tool sm-insert-fig'
  }

  onClick () {
    this.refs.input.val(null)
    this.refs.input.click()
  }

  onFileSelect (e) {
    let files = e.currentTarget.files
    this.executeCommand({
      files: Array.prototype.slice.call(files)
    })
  }
}
