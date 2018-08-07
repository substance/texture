import { Component } from 'substance'

export default class CompositeModelComponent extends Component {
  render ($$) {
    const model = this.props.model
    let el = $$('div')
      .addClass(this.getClassNames())

    let properties = model.getProperties()
    properties.forEach(property => {
      let valueModel = property.valueModel
      let ModelComponent = this._getPropertyComponent(property)
      el.append(
        $$(ModelComponent, {
          model: valueModel,
          label: property.name
        }).addClass(`sm-${property.name}`)
      )
    })
    return el
  }

  _getPropertyComponent (property) {
    return this.getComponent(property.valueModel.type)
  }

  getClassNames () {
    return `sc-composite sm-${this.props.model.type}`
  }
}
