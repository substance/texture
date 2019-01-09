import { DocumentNode, STRING } from 'substance'

export default class Subject extends DocumentNode {}
Subject.schema = {
  type: 'subject',
  name: STRING,
  category: STRING,
  language: STRING
}
