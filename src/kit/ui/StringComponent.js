import { Component, getKeyForPath, $$ } from 'substance'
import TextInput from './TextInput'

export default class StringComponent extends Component {
  render () {
    const { placeholder, path, readOnly, document } = this.props
    const parentSurface = this.context.surface
    const name = getKeyForPath(path)
    // Note: readOnly and within a ContainerEditor a text property is
    // plain, not as a surface
    if (readOnly || (parentSurface && parentSurface._isContainerEditor)) {
      const TextPropertyComponent = this.getComponent('text-property')
      return $$(TextPropertyComponent, {
        doc: document,
        tagName: 'div',
        placeholder,
        path
      })
    } else {
      return $$(TextInput, {
        name,
        path,
        placeholder
      })
    }
  }
}
