import ValueComponent from './ValueComponent'

export default class ObjectComponent extends ValueComponent {
  render ($$) {
    let el = $$('div').addClass('sc-object')
    // TODO: implement a default editor for object type values
    return el
  }
}
