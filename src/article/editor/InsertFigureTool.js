import { ToggleTool } from 'substance'

class InsertFigureTool extends ToggleTool {

  getClassNames() {
    return 'sc-insert-figure-tool'
  }

  renderButton($$) {
    let button = super.renderButton($$)
    let input = $$('input').attr('type', 'file').ref('input')
      .on('change', this.onFileSelect)
    return [button, input]
  }

  onClick() {
    this.refs.input.click()
  }

  onFileSelect(e) {
    let files = e.currentTarget.files
    this.executeCommand({
      files: Array.prototype.slice.call(files)
    })
  }

}

export default InsertFigureTool
