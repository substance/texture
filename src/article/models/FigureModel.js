import DefaultModel from './DefaultModel'
import AnnotatedTextModel from './AnnotatedTextModel'
import ContainerModel from './ContainerModel'
import { getLabel, getPos } from '../editor/nodeHelpers'

export default class FigureModel extends DefaultModel {
  // Type is different to JATS node types (fig, table-wrap)
  get type () {
    return 'figure'
  }

  // TODO: we probably want to store the label on the model, not the node?
  getLabel () {
    return getLabel(this._node)
  }

  getPos() {
    return getPos(this._node)
  }

  getTitle () {
    const titleNode = this._node.find('title')
    return new AnnotatedTextModel(this._api, titleNode)
  }

  getCaption () {
    let captionNode = this._node.find('caption')
    return new ContainerModel(this._api, captionNode)
  }

  /*
    For now we use the XML node type to differentiate between table and graphic figures
  */
  getContentType () {
    switch (this._node.type) {
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
  getContent () {
    let contentType = this.getContentType()
    const contentNode = this._node.findChild(contentType)
    return this._api.getModel(contentType, contentNode)
  }
}
