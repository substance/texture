import { ModelComponent } from '../../kit'

export default class MetaSectionTOCEntry extends ModelComponent {
  render ($$) {
    const id = this.props.id
    const name = this.props.name
    const model = this.props.model
    let el = $$('a').addClass('sc-meta-section-toc-entry')
      .attr({ href: '#' + id })

    let label = this.getLabel(name)
    if (model.isCollection) {
      const items = model.getItems()
      if (items.length > 0) {
        label = label + ' (' + items.length + ')'
        el.append(label)
      }
    } else {
      el.append(label)
    }

    return el
  }
}
