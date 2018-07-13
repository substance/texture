import { Configurator, XMLDocumentImporter, registerSchema } from 'substance'
import ManifestSchema from "./ManifestSchema"
import ManifestDocument from "./ManifestDocument"

/**
 * @module dar/ManifestLoaderNew
 * 
 * @description
 * A manifest loader which loads the raw manifest of a DAR and converts 
 * it to a ManifestDocument instance
 */
export default class ManifestLoaderNew {

  constructor() {
    this._configurator = new Configurator()
    this._configure()
  }

  /**
   * Loads the raw manifest of a DAR and converts it to an instance of the ManifestDocument class
   * 
   * @param {Object} rawManifest The raw manifest of a DAR
   * @returns {Promise} A promise that will be resolved with the manifest of a DAR as instance of the ManifestDocument class or 
   * rejected with errors that occured during the loading process 
   */
  load(rawManifest) {
    var self = this

    return new Promise(function (resolve, reject) {
      if (!rawManifest) {
        reject('manifest.xml is missing')
      }

      try {
        let manifestImporter = self._configurator.createImporter(ManifestSchema.getName())
        resolve(manifestImporter.importDocument(rawManifest))
      } catch (errors) {
        reject(errors)
      }
    })
  }

  /**
   * Geths the configurator of this manifest loader
   * @return {Configurator} The configurator of this manifest loader
   */
  getConfigurator() {
    return this._configurator
  }

  /**
   * Configures this manifest loader
   */
  _configure() {
    registerSchema(this._configurator, ManifestSchema, ManifestDocument, {
      ImporterClass: XMLDocumentImporter
    })
  }
}