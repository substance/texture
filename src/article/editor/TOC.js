import { Component, DefaultDOMElement } from 'substance'

export default class TOC extends Component {
  didMount () {
    let tocProvider = this.props.tocProvider
    tocProvider.on('toc:updated', this.onTOCUpdated, this)
  }

  dispose () {
    let tocProvider = this.props.tocProvider
    tocProvider.off(this)
  }

  render ($$) {
    let tocProvider = this.props.tocProvider
    let activeEntry = tocProvider.activeEntry
    let tocEntries = $$('div')
      .addClass('se-toc-entries')
      .ref('tocEntries')

    let entries = tocProvider.getEntries()
    if (entries.length >= 2) {
      for (let i = 0; i < entries.length; i++) {
        let entry = entries[i]
        let level = entry.level

        let tocEntryEl = $$('a')
          .addClass('se-toc-entry sm-level-' + level)
          .attr({
            href: '#',
            'data-id': entry.id
          })
          .ref(entry.id)
          .on('click', this.handleClick)
          .append(
            entry.name
          )
        if (activeEntry === entry.id) {
          tocEntryEl.addClass('sm-active')
        }
        tocEntries.append(tocEntryEl)
      }
    }

    let el = $$('div').addClass('sc-toc').append(
      tocEntries
    )
    return el
  }

  onTOCUpdated () {
    this.rerender()
  }

  handleClick (e) {
    e.preventDefault()
    // ATTENTION: wrap the native element here so that this works for testing too
    let target = DefaultDOMElement.wrap(e.currentTarget)
    const nodeId = target.getAttribute('data-id')
    this.send('tocEntrySelected', nodeId)
  }
}
