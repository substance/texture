import { Component, domHelpers } from 'substance'
import { ValueComponent, renderModel, createValueModel } from '../../kit'

// TODO: this needs to be redesigned
// TODO: we should follow the same approach as in Metadata, i.e. having a model which is a list of sections
export default class ManuscriptTOC extends Component {
  render ($$) {
    let el = $$('div').addClass('sc-toc')
    let manuscriptModel = this.props.model

    let tocEntries = $$('div')
      .addClass('se-toc-entries')
      .ref('tocEntries')
      .on('click', domHelpers.stop)

    tocEntries.append(
      $$(SectionTOCEntry, {
        label: this.getLabel('title'),
        section: 'title'
      })
    )

    tocEntries.append(
      $$(SectionTOCEntry, {
        label: this.getLabel('abstract'),
        section: 'abstract'
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
        section: 'footnotes'
      })
    )

    tocEntries.append(
      $$(DynamicTOCEntry, {
        label: this.getLabel('references-label'),
        model: manuscriptModel.getReferences(),
        section: 'references'
      })
    )

    el.append(tocEntries)

    return el
  }

  onTOCUpdated () {
    this.rerender()
  }
}

class SectionTOCEntry extends Component {
  render ($$) {
    const { label, section } = this.props
    let el = $$('a')
      .addClass('se-toc-entry sm-level-1')
      .attr({
        'data-section': section,
        href: `#viewName=manuscript,section=${section}`
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
    let { label, model, section } = this.props
    let el = $$('a')
      .addClass('se-toc-entry sm-level-1')
      .attr({
        'data-section': section,
        href: `#viewName=manuscript,section=${section}`
      })
      .append(label)
    if (model.length === 0) {
      el.addClass('sm-hidden')
    }
    return el
  }
}
