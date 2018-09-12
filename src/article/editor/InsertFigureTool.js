import { ToggleTool } from '../../kit'

export default class InsertFigureTool extends ToggleTool {
  renderButton ($$) {
    let button = super.renderButton($$)
    let input = $$('input').attr({
      'type': 'file',
      'multiple': 'multiple'
    }).ref('input')
      .on('change', this.onFileSelect)
    return [button, input]
  }

  getClassNames () {
    return 'sc-insert-figure-tool'
  }

  onClick () {
    this.refs.input.click()
  }

  onFileSelect (e) {
    let files = e.currentTarget.files
    this.executeCommand({
      files: Array.prototype.slice.call(files)
    })
  }
}
