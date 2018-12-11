import UploadTool from './UploadTool'

export default class AddFigurePanelTool extends UploadTool {
  getClassNames () {
    return 'sc-add-figure-panel-tool sm-upload-tool'
  }

  getFileType () {
    return 'image/*'
  }

  uploadMultiple () {
    return false
  }
}
