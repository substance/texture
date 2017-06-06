import { BasePackage as SubstanceBasePackage } from 'substance'
import { TextureJATSPackage } from 'texture-jats'
import TextNodeComponent from './TextNodeComponent'
import ContainerNodeComponent from './ContainerNodeComponent'
import UnsupportedNodeComponent from './UnsupportedNodeComponent'
import HeadingComponent from './HeadingComponent'

export default {
  name: 'texture-base',
  configure(config) {
    config.import(SubstanceBasePackage)
    config.import(TextureJATSPackage)
    config.addComponent('text', TextNodeComponent)
    config.addComponent('container', ContainerNodeComponent)
    config.addComponent('heading', HeadingComponent)
    config.addComponent('unsupported', UnsupportedNodeComponent)
  }
}