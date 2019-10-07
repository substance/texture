import { Component, $$ } from 'substance'

export default class ManuscriptSection extends Component {
  render () {
    const { name, label, children } = this.props
    const SectionLabel = this.getComponent('section-label')

    const el = $$('div', { class: `sc-manuscript-section sm-${name}`, 'data-section': name })
    el.append($$(SectionLabel, { label }))
    el.append(children)

    return el
  }
}
