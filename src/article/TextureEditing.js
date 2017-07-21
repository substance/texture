import { Editing, validateXMLSchema, isString, paste } from 'substance'
import TextureJATS from './TextureJATS'

export default class TextureEditing extends Editing {

  // EXPERIMENTAL: run validation after pasting
  // and throw if there are errors
  // We need to find out which is the best way regarding schema
  // strictness
  // While it would be fantastic to be 100% strict all the time
  // it could also be a way to introduce an issue system
  // and instead failing badly, just make the user aware of these
  // issues
  // TODO: in general we would need to 'pre-process'
  paste(tx, content) {
    if (!content) return
    /* istanbul ignore else  */
    if (isString(content)) {
      paste(tx, {text: content})
    } else if (content._isDocument) {
      paste(tx, {doc: content})
    } else {
      throw new Error('Illegal content for paste.')
    }

    let res = validateXMLSchema(TextureJATS, tx.getDocument().toXML())
    if (!res.ok) {
      res.errors.forEach((err) => {
        console.error(err.msg, err.el)
      })
      throw new Error('Paste is violating the schema')
    }

  }

}