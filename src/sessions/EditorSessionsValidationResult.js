/** 
 * @module editor/util/EditorSessionsValidationResult
 */
export default class EditorSessionsValidationResult {
  constructor() {
    this._ok = true
    this._errors = []
  }

  addError(error) {
    this._errors.push(error)
  }

  /**
   * TODO check if concat is used correctly 
   */
  addErrors(errors) {
    this._errors = this._errors.concat(errors)
  }

  getErrors() {
    return this._errors
  }

  setErrors(errors) {
    this._errors = errors
  }

  isOk() {
    return this._ok
  }

  setOk(ok) {
    this._ok = ok
  }
}