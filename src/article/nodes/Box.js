import { DocumentNode, CONTAINER } from 'substance'

export default class Box extends DocumentNode
{
  static getTemplate ()
  {
    return {
      type: 'box',
      content: [{
          type: 'paragraph' 
        }
      ]
    }
  }
}

Box.schema = {
  type: 'box',
  content: CONTAINER('paragraph')
}
