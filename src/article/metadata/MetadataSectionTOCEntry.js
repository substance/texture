import { ModelComponent } from '../../kit'

export default class MetaSectionTOCEntry extends ModelComponent {
  render ($$) {
    const id = this.props.id
    const name = this.props.name
    const model = this.props.model
    let el = $$('a').addClass('sc-meta-section-toc-entry')
      .attr({ href: '#' + id })
      .on('click', this.handleClick)

    let label = this.getLabel(name)
    if (model.isCollection) {
      const items = model.getItems()
      if (items.length > 0) {
        label = label + ' (' + items.length + ')'
        el.setStyle('display', 'block').append(label)
      } else {
        el.setStyle('display', 'none')
      }
    } else {
      el.append(label)
    }

    return el
  }

  handleClick (e) {
    // NOTE: currently we are using link anchors for metadata panel navigation
    // this way we are preventing Electron from opening links in a new window
    // later we want to introduce different routing mechanism
    e.stopPropagation()
  }
}
