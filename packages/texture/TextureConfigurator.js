import { ProseEditorPackage } from 'substance'
// TODO: we should have a better base Configurator in core
const Configurator = ProseEditorPackage.Configurator

class TextureConfigurator extends Configurator {

  constructor(...args) {
    super(...args)
    this.config.XMLStoreClass = null
  }

  setXMLStore(XMLStoreClass) {
    this.config.XMLStoreClass = XMLStoreClass;
  }

  getXMLStore() {
    var XMLStoreClass = this.config.XMLStoreClass;
    return new XMLStoreClass();
  }

}

export default TextureConfigurator
