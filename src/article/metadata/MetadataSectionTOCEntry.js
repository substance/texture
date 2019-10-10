import { $$ } from 'substance'
import { ModelComponent } from '../../kit'

export default class MetadataSectionTOCEntry extends ModelComponent {
  render () {
    const name = this.props.name
    const model = this.props.model
    let el = $$('div').addClass('sc-meta-section-toc-entry sc-toc-entry')
      .attr({ 'data-section': name })
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

  handleClick (event) {
    event.stopPropagation()
    event.preventDefault()
    // this is handled by MetadataEditor
    this.send('scrollTo', { section: this.props.name })
  }
}
