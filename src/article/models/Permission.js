import { DocumentNode, STRING, TEXT } from 'substance'
import { RICH_TEXT_ANNOS } from './modelConstants'

export default class Permission extends DocumentNode {
  isEmpty () {
    return !(this.copyrightStatement || this.copyrightYear || this.copyrightHolder || this.license || this.licenseText)
  }
}
Permission.schema = {
  type: 'permission',
  copyrightStatement: STRING,
  copyrightYear: STRING,
  copyrightHolder: STRING,
  // URL to license description  used as a unique license identifier
  // FIXME: bad naming. Use url, or licenseUrl?
  license: STRING,
  licenseText: TEXT(RICH_TEXT_ANNOS)
}
