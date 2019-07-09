import { Component, domHelpers, DefaultDOMElement } from 'substance'
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
      .addClass('sc-toc-entry sm-level-1')
      .attr({ 'data-section': section })
      .on('click', this._onClick)
      .append(label)
    return el
  }

  _onClick (event) {
    event.preventDefault()
    event.stopPropagation()
    this.send('scrollTo', { section: this.props.section })
  }
}

class BodyTOCEntry extends ValueComponent {
  render ($$) {
    let items = this.props.model.getItems()
    let headings = items.filter(node => node.type === 'heading')
    return $$('div').addClass('sc-toc-entry').append(
      headings.map(heading => {
        let el = $$(TOCHeadingEntry, { node: heading }).ref(heading.id)
          .addClass(`sc-toc-entry sm-level-${heading.level}`)
          .attr({ 'data-id': heading.id })
          .on('click', this._onClick)
        return el
      })
    )
  }

  _onClick (event) {
    let target = DefaultDOMElement.wrap(event.currentTarget)
    let nodeId = target.attr('data-id')
    event.preventDefault()
    event.stopPropagation()
    this.send('scrollTo', { nodeId })
  }
}

class TOCHeadingEntry extends Component {
  didMount () {
    this.context.appState.addObserver(['document'], this.rerender, this, {
      stage: 'render',
      document: { path: [this.props.node.id] }
    })
  }
  dispose () {
    this.context.appState.removeObserver(this)
  }
  render ($$) {
    const api = this.context.api
    let heading = this.props.node
    return $$('div').append(
      renderModel($$, this, createValueModel(api, heading.getPath()), { readOnly: true })
    )
  }
}

// only visible when collection not empty
class DynamicTOCEntry extends ValueComponent {
  render ($$) {
    let { label, model, section } = this.props
    let el = $$('div')
      .addClass('sc-toc-entry sm-level-1')
      .attr({ 'data-section': section })
      .on('click', this._onClick)
      .append(label)
    if (model.length === 0) {
      el.addClass('sm-hidden')
    }
    return el
  }

  _onClick (event) {
    event.preventDefault()
    event.stopPropagation()
    this.send('scrollTo', { section: this.props.section })
  }
}
