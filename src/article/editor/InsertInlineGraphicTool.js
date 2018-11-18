import UploadTool from './UploadTool'

export default class InsertInlineGraphicTool extends UploadTool {
  getClassNames () {
    return 'sc-insert-inline-graphic-tool sm-upload-tool'
  }

  getFileType () {
    return 'image/*'
  }
}
