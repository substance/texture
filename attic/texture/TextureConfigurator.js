import { Configurator } from 'substance'
import SaveHandlerStub from './SaveHandlerStub'
import FileClientStub from './FileClientStub'

class TextureConfigurator extends Configurator {

  constructor(...args) {
    super(...args)

    this.config.saveHandler = new SaveHandlerStub()
    this.config.fileClient = new FileClientStub()
    this.config.xmlStore = null
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

  setXMLStore(XMLStoreClass, params) {
    this.config.xmlStore = {
      Class: XMLStoreClass,
      params: params
    }
    return this
  }

  getXMLStore() {
    let xmlStore = this.config.xmlStore
    let XMLStoreClass = this.config.xmlStore.Class
    return new XMLStoreClass(this.config.xmlStore.params)
  }

}

export default TextureConfigurator
