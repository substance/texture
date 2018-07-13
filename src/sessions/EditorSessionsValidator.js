import EditorSessionsValidationResult from "./EditorSessionsValidationResult"

/** 
 * @module editor/util/EditorSessionsValidator
 * 
 * @description
 * A service class that provived various method to 
 * check the validity of an editor (or better document archive - DAR?) session
 */
export default class EditorSessionsValidator {

  /**
   * Validates sessions coming from an editor (or better document archive - DAR)
   * 
   * @param {Object} sessions The sessions to validate
   * @returns {Promise} A promise that will be resolved with the result of the validation
   * or rejected with errors that occured during the validation process 
   */
  static areSessionsValid(sessions) {
    return new Promise(function (resolve, reject) {
      let validationResult = new EditorSessionsValidationResult()

      if (!sessions["manifest"]) {
        validationResult.setOk(false)
        validationResult.addError("There must be a manifest session.")
      }

      resolve(validationResult)
    })
  }
}