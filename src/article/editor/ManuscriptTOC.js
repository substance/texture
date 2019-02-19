import { Component, DefaultDOMElement, domHelpers } from 'substance'
import { ValueComponent, renderModel, createValueModel } from '../../kit'

// TODO: this needs to be redesigned
// TODO: we should follow the same approach as in Metadata, i.e. having a model which is a list of sections
export default class ManuscriptTOC extends Component {
  render ($$) {
    let el = $$('div').addClass('sc-toc')
    let manuscriptModel = this.props.model

    let tocEntries = $$('div')
      .addClass('se-toc-entries')
      .on('click', this.handleClick)
      .ref('tocEntries')

    tocEntries.append(
      $$(SimpleTOCEntry, {
        label: this.getLabel('title'),
        id: 'title'
      })
    )

    tocEntries.append(
      $$(SimpleTOCEntry, {
        label: this.getLabel('abstract'),
        id: 'abstract'
      })
    )

    tocEntries.append(
      $$(BodyTOCEntry, {
        label: this.getLabel('body'),
        model: manuscriptModel.getBody()
      })
    )

    tocEntries.append(
      $$(DynamicTOCEntry, {
        label: this.getLabel('footnotes-label'),
        model: manuscriptModel.getFootnotes(),
        id: 'footnotes'
      })
    )

    tocEntries.append(
      $$(DynamicTOCEntry, {
        label: this.getLabel('references-label'),
        model: manuscriptModel.getReferences(),
        id: 'references'
      })
    )

    el.append(tocEntries)

    return el
  }

  onTOCUpdated () {
    this.rerender()
  }

  handleClick (e) {
    // e.preventDefault()
    // ATTENTION: wrap the native element here so that this works for testing too
    let target = DefaultDOMElement.wrap(e.target)
    let tocEntry = domHelpers.findParent(target, '.se-toc-entry')
    if (tocEntry) {
      const nodeId = tocEntry.getAttribute('data-id')
      this.send('tocEntrySelected', nodeId)
    }
  }
}

class SimpleTOCEntry extends Component {
  render ($$) {
    const { label, id } = this.props
    let el = $$('a')
      .addClass('se-toc-entry sm-level-1')
      .attr({
        href: `#viewName=manuscript,nodeId=${id}`,
        'data-id': id
      })
      .append(label)
    return el
  }
}

class BodyTOCEntry extends ValueComponent {
  render ($$) {
    const api = this.context.api
    let items = this.props.model.getItems()
    let headings = items.filter(node => node.type === 'heading')
    return $$('div').addClass('sc-body-toc-entry').append(
      headings.map(heading => {
        let el = $$('a').ref(heading.id)
          .addClass(`se-toc-entry sm-level-${heading.level}`)
          .attr({
            href: `#viewName=manuscript,nodeId=${heading.id}`,
            'data-id': heading.id
          })
        el.append(
          renderModel($$, this, createValueModel(api, heading.getPath()), { readOnly: true })
        )
        return el
      })
    )
  }
}

// only visible when collection not empty
class DynamicTOCEntry extends ValueComponent {
  render ($$) {
    let { label, model, id } = this.props
    let el = $$('a')
      .addClass('se-toc-entry sm-level-1')
      .attr({
        href: `#viewName=manuscript,nodeId=${id}`,
        'data-id': id
      })
      .append(label)
    if (model.length === 0) {
      el.addClass('sm-hidden')
    }
    return el
  }
}
