import ValueComponent from './ValueComponent'

export default class ObjectModelEditor extends ValueComponent {
  render ($$) {
    let el = $$('div').addClass('sc-object-model-editor')
    // TODO: implement a default editor for object type values
    return el
  }
}
