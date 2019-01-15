import { TreeIndex } from 'substance'

const EMPTY = Object.freeze({})

// ATTENTION: this is a prototype implementation and will be redesigned when the requirements clear.
export default class ExperimentalEditorSettings {
  constructor () {
    this._settings = new TreeIndex()
  }

  // getConfiguration (xpath) {
  //   // ATTENTION: for the moment only non-hierarchical selectors
  //   let current = last(xpath)
  //   let config = this._settings
  //   let nodeConfig = config[current.type]
  //   let result = EMPTY
  //   if (nodeConfig) {
  //     let propConfig = nodeConfig[current.property]
  //     if (propConfig) {
  //       result = propConfig
  //     }
  //   }
  //   return result
  // }

  getSettingsForValue (path) {
    return this._settings.get(path) || EMPTY
  }

  load (settings) {
    this._settings.clear()
    this.extend(settings)
  }

  extend (settings) {
    let selectors = Object.keys(settings)
    for (let selector of selectors) {
      this._extendValueSettings(selector, settings[selector])
    }
  }

  _extendValueSettings (selector, spec) {
    if (selector.indexOf('<') !== -1) throw new Error('hierarchical selectors not supported yet')
    let path = selector.trim().split('.')
    let valueSettings = this._settings.get(path)
    if (!valueSettings) {
      valueSettings = {}
      this._settings.set(path, valueSettings)
    }
    Object.assign(valueSettings, spec)
  }
}
