import {
    IncrementalData, DefaultDOMElement, Document,
    PropertyIndex, AnnotationIndex, ContainerAnnotationIndex,
} from 'substance'
import XMLNodeFactory from './XMLNodeFactory'

export default
class XMLDocument extends Document {

  _initialize() {
    this.nodeFactory = new XMLNodeFactory(this)
    this.data = new IncrementalData(this.schema, this.nodeFactory)

    this.el = DefaultDOMElement.createDocument('xml')

    // all by type
    this.addIndex('type', new PropertyIndex('type'))
    // special index for (property-scoped) annotations
    this.addIndex('annotations', new AnnotationIndex())
    // TODO: these are only necessary if there is a container annotation
    // in the schema
    // special index for (container-scoped) annotations
    this.addIndex('container-annotations', new ContainerAnnotationIndex())
  }

}