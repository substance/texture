import { Configurator } from 'substance'
import SaveHandlerStub from './SaveHandlerStub'
import FileClientStub from './FileClientStub'

class TextureConfigurator extends Configurator {

  constructor(...args) {
    super(...args)

    this.config.saveHandler = new SaveHandlerStub()
    this.config.fileClient = new FileClientStub()
    this.config.XMLStoreClass = null
  }

  setSaveHandler(saveHandler) {
    this.config.saveHandler = saveHandler
  }

  setFileClient(fileClient) {
    this.config.fileClient = fileClient
  }

  getFileClient() {
    return this.config.fileClient
  }

  getSaveHandler() {
    return this.config.saveHandler
  }

  setXMLStore(XMLStoreClass) {
    this.config.XMLStoreClass = XMLStoreClass
  }

  getXMLStore() {
    var XMLStoreClass = this.config.XMLStoreClass
    return new XMLStoreClass()
  }

}

export default TextureConfigurator