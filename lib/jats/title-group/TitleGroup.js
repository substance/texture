import { Container } from 'substance'

class TitleGroup extends Container {}

TitleGroup.type = "title-group"

/*
  Content
  (
    article-title, subtitle*, trans-title-group*, alt-title*, fn-group?
  )
*/
TitleGroup.define({
  attributes: { type: 'object', default: {} },
  nodes: { type: ['id'], default: [] }
});

export default TitleGroup
