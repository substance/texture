import { DefaultDOMElement as DOM } from 'substance'
import vfs from 'vfs'
import JATS from '../util/JATS'
import Validator from './Validator'

window.onload = function() {
  let xml = vfs.readFileSync('data/elife-15278.xml')
  let dom = DOM.parseXML(xml)
  let articleEl = dom.find('article')
  let validator = new Validator(JATS)
  let valid = validator.isValid(articleEl)
  if (!valid) {
    console.info('Article is invalid. \uD83D\uDE1E')
    validator.errors.forEach(e => {
      console.error(e)
    })
  } else {
    console.info('Article is valid. \uD83D\uDE0D')
  }
}
