import { Configurator } from 'substance'
import SaveHandlerStub from './SaveHandlerStub'
import FileClientStub from './FileClientStub'

class TextureConfigurator extends Configurator {

  constructor(...args) {
    super(...args)

    this.config.saveHandler = new SaveHandlerStub()
    this.config.fileClient = new FileClientStub()
    this.config.XMLStoreClass = null
    this.config.InterfaceComponentClass = null
  }

  setInterfaceComponentClass(Class) {
    if (this.config.InterfaceComponentClass) {
      throw new Error("InterfaceComponetClass can't be set twice")
    }
    this.config.InterfaceComponentClass = Class
  }

  getInterfaceComponentClass() {
    return this.config.InterfaceComponentClass
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
    return this
  }

  getXMLStore() {
    var XMLStoreClass = this.config.XMLStoreClass
    return new XMLStoreClass()
  }

}

export default TextureConfigurator