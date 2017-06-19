import { Component } from 'substance'
import MetadataSection from './MetadataSection'

export default class MetadataComponent extends Component {

  render($$) {
    const ScrollPane = this.getComponent('scroll-pane')
    const metadataSpec = this.props.metadataSpec
    const doc = this.context.editorSession.getDocument()
    // const articleMeta = doc.find('article-meta')
    let el = $$('div').addClass('sc-metadata')

    let scrollPane = $$(ScrollPane).ref('metadataScroll')

    metadataSpec.forEach((entry) => {
      if (entry.section) {
        let isActive = entry.section === this.state.activeSection

        scrollPane.append(
          $$(MetadataSection, {
            label: entry.label,
            expanded: isActive
          }).on('click', this._switchSection.bind(this, entry.section))
        )

        if (isActive) {
          const node = doc.find(entry.nodeSelector)
          let Component = this.getComponent(entry.section)
          scrollPane.append(
            $$(Component, { node: node })
          )
        }
      } else {
        console.warn('TODO: Support section grouping')
      }
    })

    el.append(scrollPane)
    return el
  }

  _switchSection(sectionName) {
    this.setState({
      activeSection: sectionName
    })
  }
}
