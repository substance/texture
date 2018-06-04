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
    const title = this._node.findChild('title')
    return new AnnotatedTextModel(title, this.context)
  }

  getCaption() {
    let caption = this.doc.find('caption')
    return new ContainerModel(caption, 'abstract-content', this._getContext())
  }

  getContent() {
    
  }
}