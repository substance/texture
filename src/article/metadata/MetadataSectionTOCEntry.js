import { ModelComponent } from '../../kit'

export default class MetadataSectionTOCEntry extends ModelComponent {
  render ($$) {
    const name = this.props.name
    const model = this.props.model
    let el = $$('a').addClass('sc-meta-section-toc-entry')
      .attr({
        href: '#viewName=metadata,section=' + name,
        'data-section': name
      })
      .on('click', this.handleClick)

    let label = this.getLabel(name)
    if (model.isCollection) {
      const items = model.getItems()
      if (items.length > 0) {
        label = label + ' (' + items.length + ')'
        el.append(label)
      } else {
        el.addClass('sm-empty')
      }
    } else {
      el.append(label)
    }

    return el
  }

  handleClick (e) {
    // NOTE: currently we are using link anchors for metadata panel navigation
    // this way we are preventing Electron from opening links in a new window
    e.stopPropagation()
  }
}
