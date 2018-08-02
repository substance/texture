import { Component, TextPropertyEditor } from 'substance'

export default class StringModelEditor extends Component {
  render ($$) {
    let model = this.props.model
    return $$(TextPropertyEditor, { path: model._path }).ref(model.id)
  }
}
