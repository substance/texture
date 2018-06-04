import DefaultModel from './DefaultModel'
import AnnotatedTextModel from './AnnotatedTextModel'
import ContainerModel from './ContainerModel'
import { getLabel, getPos } from '../../editor/util/nodeHelpers'

export default class FigureModel extends DefaultModel {
  
  // Type is different to JATS node types (fig, table-wrap)
  get type() {
    return 'figure'
  }
  
  // TODO: we probably want to store the label on the model, not the node?
  getLabel() {
    return getLabel(this._node)
  }

  getPos() {
    return getPos(this._node)
  }

  getTitle() {
    const title = this._node.find('title')
    return new AnnotatedTextModel(title, this.context)
  }

  getCaption() {
    let caption = this._node.find('caption')
    return new ContainerModel(caption, this.context)
  }

  /*
    For now we use the XML node type to differentiate between table and graphic figures
  */
  getContentType() {
    switch(this._node.type) {
      case 'table-wrap': {
        return 'table'
      }
      default: return 'graphic'
    }
  }

  /*
    Returns the content model (e.g. a Table or a Graphic)

    TODO: return a Model instead of a Node.
  */
  getContent() {
    let contentType = this.getContentType()
    const content = this._node.findChild(contentType)
    return content
  }
}