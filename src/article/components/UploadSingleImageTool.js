import UploadTool from './UploadTool'

// This is a base class for tools that upload a file
export default class UploadSingleImageTool extends UploadTool {
  getFileType () {
    return 'image/*'
  }

  get canUploadMultiple () {
    return false
  }
}
