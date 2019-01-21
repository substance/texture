import FileUploadComponent from './FileUploadComponent'

export default class SupplementaryFileUploadComponent extends FileUploadComponent {
  _onFileLoad (e) {
    let files = e.currentTarget.files
    if (files) {
      this.send('importFile', files[0])
    }
  }
}
