import Abstract from './Abstract'
import { CONTAINER, STRING, TEXT } from 'substance'
import { RICH_TEXT_ANNOS } from './modelConstants'

export default class CustomAbstract extends Abstract {}
CustomAbstract.schema = {
  type: 'custom-abstract',
  abstractType: STRING,
  title: TEXT(RICH_TEXT_ANNOS),
  content: CONTAINER('paragraph')
}
