import UploadTool from '../shared/UploadTool'

export default class InsertFigureTool extends UploadTool {
  getClassNames () {
    return 'sc-insert-figure-tool sm-upload-tool'
  }

  getFileType () {
    return 'image/*'
  }

  get uploadMultiple () {
    return true
  }
}
