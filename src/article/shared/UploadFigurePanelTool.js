import UploadTool from './UploadTool'

export default class UploadFigurePanelTool extends UploadTool {
  getClassNames () {
    return 'sc-upload-figure-panel-tool sm-upload-tool'
  }

  getFileType () {
    return 'image/*'
  }

  uploadMultiple () {
    return false
  }
}
