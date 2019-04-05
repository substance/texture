import UploadTool from './UploadTool'

export default class InsertInlineGraphicTool extends UploadTool {
  getClassNames () {
    return 'sc-insert-inline-graphic-tool sc-upload-tool sc-tool'
  }

  getFileType () {
    return 'image/*'
  }
}
