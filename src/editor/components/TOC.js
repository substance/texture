import { Component, FontAwesomeIcon } from 'substance'

export default class TOC extends Component {

  didMount() {
    let tocProvider = this.context.tocProvider
    tocProvider.on('toc:updated', this.onTOCUpdated, this)
  }

  dispose() {
    let tocProvider = this.context.tocProvider
    tocProvider.off(this)
  }

  render($$) {
    let tocProvider = this.context.tocProvider
    let activeEntry = tocProvider.activeEntry
    let tocEntries = $$("div")
      .addClass("se-toc-entries")
      .ref('tocEntries')

    let entries = tocProvider.getEntries()
    if (entries.length >= 2) {
      for (let i = 0; i < entries.length; i++) {
        let entry = entries[i]
        let level = entry.level

        let tocEntryEl = $$('a')
          .addClass('se-toc-entry sm-level-'+level)
          .attr({
            href: "#",
            "data-id": entry.id,
          })
          .ref(entry.id)
          .on('click', this.handleClick)
          .append(
            entry.name
          )
        if (activeEntry === entry.id) {
          tocEntryEl.addClass("sm-active")
        }
        tocEntries.append(tocEntryEl)
      }
    }

    let reproduceMode = this.context.appState.reproduce
    let icon = reproduceMode ? 'fa-check-square-o' : 'fa-square-o'

    tocEntries.append(
      $$('button').addClass('se-toggle-reproduce se-toc-entry sm-level-1').append(
        $$(FontAwesomeIcon, {icon:  icon }),
        ' Reproduce'
      ).on('click', this._toggleReproduce)
    )

    let el = $$('div').addClass('sc-toc').append(
      tocEntries
    )
    return el
  }

  _toggleReproduce() {
    this.send('toggleReproduce')
    this.rerender()
  }

  getDocument() {
    return this.context.doc
  }

  onTOCUpdated() {
    this.rerender()
  }

  handleClick(e) {
    e.preventDefault()
    let nodeId = e.currentTarget.dataset.id
    this.send('tocEntrySelected', nodeId)
  }

}
