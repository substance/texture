import { Component } from 'substance'
import FormInputComponent from './FormInputComponent'
import FormCheckboxComponent from './FormCheckboxComponent'

export default class FormRowComponent extends Component {
  render($$) {
    const fields = this.props.fields
    const el = $$('div').addClass('sc-form-row')
    fields.forEach(field => {
      const type = field.type
      let comp
      if(type === 'text' || type === 'email') {
        comp = FormInputComponent
      } else if (type === 'checkbox') {
        comp = FormCheckboxComponent
      }

      if(!comp) {
        console.error('Error: there is no component for type ' + type)
      } else {
        el.append(
          $$(comp, field)
        )
      }
    })

    return el
  }
}
