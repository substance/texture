import { Configurator, merge } from 'substance'

export default class TextureConfigurator extends Configurator {
  constructor () {
    super()

    this.config.configurations = {}
  }

  static createFrom (parentConfig) {
    let ConfiguratorClass = this
    let config = new ConfiguratorClass()
    merge(config, parentConfig)
    return config
  }

  createScope (name) {
    let ConfiguratorClass = this.constructor
    let scope = new ConfiguratorClass()
    this.setConfiguration(name, scope)
    return scope
  }

  setConfiguration (name, config) {
    this.config.configurations[name] = config

    config._name = this._name ? this._name + '/' + name : name
  }

  getConfiguration (name) {
    return this.config.configurations[name]
  }

  getComponentRegistry () {
    if (!this.componentRegistry) {
      this.componentRegistry = super.getComponentRegistry()
    }
    return this.componentRegistry
  }

  getComponent (name) {
    return this.getComponentRegistry().get(name, 'strict')
  }

  /*
    Map an XML node type to a model
  */
  addModel (nodeType, ModelClass) {
    if (this.config.models[nodeType]) {
      throw new Error(`nodeType ${nodeType} already registered.`)
    }
    this.config.models[nodeType] = ModelClass
  }

  getModelRegistry () {
    return this.config.models
  }
}
