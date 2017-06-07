import { BasePackage as SubstanceBasePackage, TextPropertyEditor } from 'substance'
import { TextureJATSPackage } from 'texture-jats'
import ContainerNodeComponent from './ContainerNodeComponent'
import HeadingComponent from './HeadingComponent'
import TextNodeComponent from './TextNodeComponent'
import UnsupportedInlineNodeComponent from './UnsupportedInlineNodeComponent'
import UnsupportedNodeComponent from './UnsupportedNodeComponent'

export default {
  name: 'texture-base',
  configure(config) {
    config.import(SubstanceBasePackage)
    config.import(TextureJATSPackage)
    config.addComponent('text', TextNodeComponent)
    config.addComponent('text-property', TextPropertyEditor)
    config.addComponent('container', ContainerNodeComponent)
    config.addComponent('heading', HeadingComponent)
    config.addComponent('unsupported', UnsupportedNodeComponent)
    config.addComponent('unsupported-inline-node', UnsupportedInlineNodeComponent)
  },
  ContainerNodeComponent,
  HeadingComponent,
  TextNodeComponent,
  UnsupportedInlineNodeComponent,
  UnsupportedNodeComponent
}