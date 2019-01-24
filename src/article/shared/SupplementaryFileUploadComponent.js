import FileUploadComponent from './FileUploadComponent'

export default class SupplementaryFileUploadComponent extends FileUploadComponent {
  _handleUploadedFiles (files) {
    if (files) {
      this.send('importFile', files)
    }
  }
}
