import { DocumentNode, STRING } from 'substance'

export default class Graphic extends DocumentNode {}
Graphic.schema = {
  type: 'graphic',
  href: STRING,
  mimeType: STRING
}
